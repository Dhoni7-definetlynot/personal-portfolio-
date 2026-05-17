import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_BASE_URL = "http://localhost:5000/api";

const PORTFOLIO_GITHUB_LINK =
  "https://github.com/Dhoni7-definetlynot/personal-portfolio-";

const INTERN_PROJECT_GITHUB_LINK =
  "https://github.com/Dhoni7-definetlynot/INTERN-TALENT-HIRING-MANAGEMENT-SYSTEM";

const GITHUB_PROFILE_LINK = "https://github.com/Dhoni7-definetlynot";

const fallbackProjects = [
  {
    id: 1,
    title: "Personal Portfolio Website",
    description:
      "A full-stack portfolio website built with React, Express, and MySQL to showcase projects, skills, and contact details.",
    tech_stack: "React.js, Node.js, Express.js, MySQL",
    github_link: PORTFOLIO_GITHUB_LINK,
    live_link: "",
  },
  {
    id: 2,
    title: "Intern Talent Hiring Management System",
    description:
      "A full-stack talent hiring management system project developed for internship practice.",
    tech_stack: "React.js, Node.js, Express.js, MySQL",
    github_link: INTERN_PROJECT_GITHUB_LINK,
    live_link: "",
  },
];

const fallbackSkills = [
  { id: 1, skill_name: "HTML", category: "Frontend" },
  { id: 2, skill_name: "CSS", category: "Frontend" },
  { id: 3, skill_name: "JavaScript", category: "Frontend" },
  { id: 4, skill_name: "React.js", category: "Frontend" },
  { id: 5, skill_name: "Node.js", category: "Backend" },
  { id: 6, skill_name: "Express.js", category: "Backend" },
  { id: 7, skill_name: "MySQL", category: "Database" },
];

const fallbackExperience = [
  {
    id: 1,
    role: "Full Stack Development Intern",
    company: "Thiranex",
    duration: "May 2026 - June 2026",
    description:
      "Building a full-stack personal portfolio project using React.js, Node.js, Express.js, and MySQL.",
  },
];

const fallbackCertifications = [
  {
    id: 1,
    title: "Full Stack Development Internship",
    provider: "Thiranex",
    year: "2026",
  },
];

function getCorrectGithubLink(project) {
  const title = (project.title || "").toLowerCase();
  const description = (project.description || "").toLowerCase();
  const projectText = `${title} ${description}`;

  if (projectText.includes("personal portfolio")) {
    return PORTFOLIO_GITHUB_LINK;
  }

  if (
    projectText.includes("intern talent") ||
    projectText.includes("talent hiring") ||
    projectText.includes("hiring management")
  ) {
    return INTERN_PROJECT_GITHUB_LINK;
  }

  return project.github_link || project.githubLink || "";
}

function normalizeProject(project) {
  return {
    ...project,
    tech_stack: project.tech_stack || project.techStack || "",
    github_link: getCorrectGithubLink(project),
    live_link: project.live_link || project.liveLink || "",
  };
}

function App() {
  const [projects, setProjects] = useState(fallbackProjects);
  const [skills, setSkills] = useState(fallbackSkills);
  const [experience, setExperience] = useState(fallbackExperience);
  const [certifications, setCertifications] = useState(fallbackCertifications);
  const [activeProject, setActiveProject] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    async function loadPortfolioData() {
      try {
        const [
          projectsResponse,
          skillsResponse,
          experienceResponse,
          certificationsResponse,
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/projects`),
          fetch(`${API_BASE_URL}/skills`),
          fetch(`${API_BASE_URL}/experience`),
          fetch(`${API_BASE_URL}/certifications`),
        ]);

        const projectsData = await projectsResponse.json();
        const skillsData = await skillsResponse.json();
        const experienceData = await experienceResponse.json();
        const certificationsData = await certificationsResponse.json();

        if (Array.isArray(projectsData) && projectsData.length > 0) {
          const fixedProjects = projectsData.map(normalizeProject);
          setProjects(fixedProjects);
        }

        if (Array.isArray(skillsData) && skillsData.length > 0) {
          setSkills(skillsData);
        }

        if (Array.isArray(experienceData) && experienceData.length > 0) {
          setExperience(experienceData);
        }

        if (
          Array.isArray(certificationsData) &&
          certificationsData.length > 0
        ) {
          setCertifications(certificationsData);
        }
      } catch (error) {
        console.error("Backend connection error:", error);
      }
    }

    loadPortfolioData();
  }, []);

  useEffect(() => {
    if (projects.length === 0) return;

    const slider = setInterval(() => {
      setActiveProject((previous) => (previous + 1) % projects.length);
    }, 3500);

    return () => clearInterval(slider);
  }, [projects.length]);

  const groupedSkills = useMemo(() => {
    return skills.reduce((groups, skill) => {
      const category = skill.category || "Other";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(skill.skill_name);
      return groups;
    }, {});
  }, [skills]);

  const selectedProject = projects[activeProject];

  const nextProject = () => {
    setActiveProject((previous) => (previous + 1) % projects.length);
  };

  const previousProject = () => {
    setActiveProject((previous) =>
      previous === 0 ? projects.length - 1 : previous - 1
    );
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage("Sending message...");

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Message not sent");
      }

      setStatusMessage("Message saved successfully in database.");
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      setStatusMessage("Backend not connected. Please check server.");
      console.error(error);
    }
  };

  return (
    <div className="portfolio-page">
      <header className="navbar">
        <a href="#home" className="logo">
          KARTHI<span>.</span>DEV
        </a>

        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <a href="#about">About</a>
          <a href="#resume">Resume</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#certifications">Certifications</a>
          <a href="#profiles">Profiles</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section id="home" className="hero-section">
          <div className="hero-left">
            <p className="small-label">Full Stack Development Intern</p>

            <h1>
              Hi, I am <span>VEERAKARTHIKEYAN V</span>
            </h1>

            <h2>B.E Computer Science and Engineering Student</h2>

            <p className="hero-description">
              I build clean and responsive web applications using React.js,
              Node.js, Express.js, and MySQL. I am improving my full-stack
              development skills through real-time internship projects.
            </p>

            <div className="hero-tags">
              <span>React.js</span>
              <span>Node.js</span>
              <span>MySQL</span>
              <span>Java</span>
            </div>

            <div className="hero-buttons">
              <a href="#projects" className="primary-button">
                View Projects
              </a>
              <a href="#contact" className="secondary-button">
                Contact Me
              </a>
            </div>
          </div>

          <div className="hero-right">
            <div className="profile-card">
              <div className="avatar-ring">
                <div className="avatar">VK</div>
              </div>

              <h3>Portfolio Dashboard</h3>
              <p>Frontend + Backend + Database</p>

              <div className="stats-grid">
                <div>
                  <strong>{projects.length}+</strong>
                  <span>Projects</span>
                </div>
                <div>
                  <strong>{skills.length}+</strong>
                  <span>Skills</span>
                </div>
                <div>
                  <strong>1</strong>
                  <span>Internship</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section">
          <p className="section-kicker">Introduction</p>
          <h2>About Me</h2>
          <p className="section-text">
            I am a Computer Science and Engineering student interested in
            full-stack development, Java backend development, database design,
            and real-time software projects. My goal is to build strong
            technical skills and become industry-ready before graduation.
          </p>
        </section>

        <section id="resume" className="section resume-section">
          <p className="section-kicker">Education</p>
          <h2>Resume Snapshot</h2>

          <div className="resume-grid">
            <div className="resume-card">
              <h3>B.E Computer Science and Engineering</h3>
              <p>Sri Krishna College of Engineering and Technology</p>
              <span>2024 - 2028</span>
            </div>

            <div className="resume-card">
              <h3>Current Focus</h3>
              <p>Full Stack Development, Java, React.js, MySQL, DSA</p>
              <span>Career Preparation</span>
            </div>

            <div className="resume-card">
              <h3>Internship Task</h3>
              <p>
                Personal portfolio website with frontend, backend, and
                database.
              </p>
              <span>Thiranex</span>
            </div>
          </div>
        </section>

        <section id="skills" className="section dark-section">
          <p className="section-kicker">Technical Stack</p>
          <h2>Skills</h2>

          <div className="skills-grid">
            {Object.entries(groupedSkills).map(([category, skillList]) => (
              <div className="skill-card" key={category}>
                <h3>{category}</h3>
                <div className="skill-pills">
                  {skillList.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="projects" className="section">
          <p className="section-kicker">Database Driven</p>
          <h2>Projects</h2>

          {selectedProject && (
            <div className="project-showcase">
              <button className="circle-button" onClick={previousProject}>
                ❮
              </button>

              <article className="project-card-main">
                <p className="project-number">
                  0{activeProject + 1} / 0{projects.length}
                </p>

                <h3>{selectedProject.title}</h3>
                <p>{selectedProject.description}</p>

                <div className="tech-list">
                  {(selectedProject.tech_stack || "")
                    .split(",")
                    .map((tech) => (
                      <span key={tech}>{tech.trim()}</span>
                    ))}
                </div>

                <div className="project-actions">
                  {selectedProject.github_link && (
                    <a
                      href={selectedProject.github_link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub
                    </a>
                  )}

                  {selectedProject.live_link && (
                    <a
                      href={selectedProject.live_link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </article>

              <button className="circle-button" onClick={nextProject}>
                ❯
              </button>
            </div>
          )}
        </section>

        <section id="experience" className="section dark-section">
          <p className="section-kicker">Work</p>
          <h2>Experience</h2>

          <div className="timeline">
            {experience.map((item) => (
              <div className="timeline-item" key={item.id}>
                <div className="timeline-dot"></div>

                <div className="timeline-content">
                  <h3>{item.role}</h3>
                  <h4>{item.company}</h4>
                  <span>{item.duration}</span>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="certifications" className="section">
          <p className="section-kicker">Achievements</p>
          <h2>Certifications</h2>

          <div className="certificate-grid">
            {certifications.map((certificate) => (
              <div className="certificate-card" key={certificate.id}>
                <h3>{certificate.title}</h3>
                <p>{certificate.provider}</p>
                <span>{certificate.year}</span>

                {certificate.certificate_link && (
                  <a
                    href={certificate.certificate_link}
                    target="_blank"
                    rel="noreferrer"
                    className="certificate-link"
                  >
                    View Certificate ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        <section id="profiles" className="section profiles-section">
          <p className="section-kicker">Online Presence</p>
          <h2>Profiles</h2>

          <div className="profile-links">
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>

            <a href={GITHUB_PROFILE_LINK} target="_blank" rel="noreferrer">
              GitHub
            </a>

            <a href="https://leetcode.com/" target="_blank" rel="noreferrer">
              LeetCode
            </a>

            <a href="mailto:727724eucs297@skcet.ac.in">Email</a>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <p className="section-kicker">Connect</p>
          <h2>Contact Me</h2>

          <form className="contact-form" onSubmit={handleContactSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <textarea
              name="message"
              placeholder="Enter your message"
              value={formData.message}
              onChange={handleInputChange}
              required
            ></textarea>

            <button type="submit">Send Message</button>
          </form>

          {statusMessage && <p className="status-message">{statusMessage}</p>}
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 VEERAKARTHIKEYAN V | Full Stack Development Intern</p>
      </footer>
    </div>
  );
}

export default App;