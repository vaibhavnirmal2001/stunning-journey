export const portfolioData = {
  identity: {
    name: "Vaibhav Nirmal",
    role: "Java Full Stack Engineer",
    tagline: "A passionate Java full stack engineer. Let's connect and cook!",
    location: "Pune, India",
    availability: "Open to Relocation",
    email: "vaibhavnirmal2001@gmail.com",
    phone: "+91 9511727791",
    company: "Blue Altair India Ltd",
    experience: "3+ Years Experience",
  },
  hero: {
    eyebrow: "Building scalable Java systems, event-driven platforms, and enterprise-grade product experiences",
    intro:
      "Java Full Stack Engineer with 3+ years building production-grade Spring Boot microservices, distributed systems, and multi-tenant enterprise platforms.",
    focusWords: ["Spring Boot", "microservices", "Angular", "distributed systems"],
    summary:
      "My primary stack is Spring Boot on the backend and Angular on the frontend, backed by Kafka, Redis, Docker, Kubernetes, PostgreSQL, and GCP. I also work with React and have hands-on knowledge of n8n, Workato, and SnapLogic for automation and integration workflows.",
    primaryAction: {
      label: "Explore Experience",
      href: "#experience",
    },
    secondaryAction: {
      label: "Get In Touch",
      href: "#contact",
    },
    badges: ["Spring Boot", "Angular", "Kafka", "Redis", "Docker", "Kubernetes"],
    metrics: [
      {
        label: "Experience",
        value: "3+ Years",
        detail: "building enterprise Java full stack applications",
      },
      {
        label: "Scale",
        value: "10K+",
        detail: "daily transactions handled across production systems",
      },
      {
        label: "Reliability",
        value: "99.9%",
        detail: "uptime supported through monitoring, alerting, and stable delivery",
      },
    ],
    runtimeSignals: [
      "Orchestrating saga-based approval workflows",
      "Streaming Kafka events across microservices",
      "Optimizing PostgreSQL and Redis-backed services",
      "Shipping monitored Spring workloads on GCP Kubernetes",
    ],
  },
  showcase: [
    {
      name: "360 Pro",
      category: "Enterprise Multi-tenant HRMS Platform",
      stack: "Spring Boot, PostgreSQL, Kafka, Redis, Angular, GCP",
      summary:
        "Owned the end-to-end backend for Timesheet and Expense Management modules with schema-level tenant isolation, secure inter-service communication, and platform-wide shared utilities.",
      highlights: [
        "Designed saga-based approval workflows across Employee, Manager, Finance, and Admin roles",
        "Built event-driven communication across 8+ microservices using Kafka for approvals, notifications, audit logging, and master-data sync",
        "Improved performance with Redis caching, CQRS-style reporting patterns, and zero-downtime Liquibase migrations",
      ],
      accent: "ember",
    },
    {
      name: "Auto Auction Platform",
      category: "B2B Vehicle Marketplace",
      stack: "Spring Boot, Kafka, Redis, WebClient, GCP",
      summary:
        "Architected low-latency REST APIs for a real-time vehicle auction marketplace serving dealers, buyers, and sellers across concurrent bidding sessions.",
      highlights: [
        "Built high-throughput backend services supporting 10K+ daily interactions",
        "Implemented Kafka event streaming and Redis caching for real-time bid state transitions and dealer notifications",
        "Integrated third-party vehicle and logistics APIs with Spring WebClient while maintaining 99.9% uptime",
      ],
      accent: "aqua",
    },
    {
      name: "College Management and Performance Systems",
      category: "Legacy Modernization and Workflow Automation",
      stack: "Spring Boot, JSP, MongoDB, REST APIs",
      summary:
        "Contributed across freelance and internship roles by extending institutional platforms, automating HR workflows, and delivering reliable modules without disrupting live users.",
      highlights: [
        "Maintained a legacy college management system deployed across 30+ institutions with backward-compatible enhancements",
        "Delivered fee management, attendance tracking, and reporting modules for production users",
        "Built backend modules for a performance management system and reduced HR processing time by 60%",
      ],
      accent: "violetless",
    },
  ],
  systemPillars: [
    {
      title: "Distributed systems with strong consistency thinking",
      copy:
        "I design microservices around clear boundaries, eventual consistency, and event-driven workflows using Saga orchestration, Kafka, CQRS-style patterns, and secure service communication.",
      bullets: ["Saga orchestration", "Event-driven design", "CQRS patterns"],
    },
    {
      title: "Multi-tenant backend engineering that scales cleanly",
      copy:
        "From schema-level tenancy and JWT auth to tenant propagation, correlation IDs, and shared platform modules, I focus on backend foundations that keep enterprise systems maintainable.",
      bullets: ["Multi-tenant architecture", "JWT and RBAC", "Correlation-ID tracing"],
    },
    {
      title: "Cloud delivery with performance and observability in mind",
      copy:
        "I work with GCP, Docker, Kubernetes, Redis, PostgreSQL tuning, Cloud Monitoring, Cloud Logging, and Slack-integrated alerting to keep production systems responsive and visible.",
      bullets: ["GCP and Kubernetes", "Redis and PostgreSQL", "Monitoring and alerting"],
    },
  ],
  journey: [
    {
      period: "Jan 2023 - Present",
      label: "Blue Altair India Ltd",
      title: "Java Full Stack Engineer",
      copy:
        "Leading backend development and serving as a primary code reviewer in a cross-functional team of 10. Built Spring Boot microservices, Kafka workflows, shared modules, tenant-aware services, Angular dashboards, and GCP-hosted deployments.",
    },
    {
      period: "2022 - 2023",
      label: "Scedd Infotech",
      title: "Freelance Java Developer",
      copy:
        "Extended and maintained a legacy Spring Boot plus JSP college management system used across 30+ institutions, delivering new features while preserving backward compatibility for live users.",
    },
    {
      period: "Oct 2022 - Dec 2022",
      label: "Ten AI Labs",
      title: "Software Developer Intern",
      copy:
        "Built Spring Boot and MongoDB backend modules for a performance management system used by 300+ employees and automated manual HR calibration workflows to reduce processing time by 60%.",
    },
  ],
  expertiseLanes: [
    {
      title: "Backend Core",
      description: "Java 21, Spring Boot 3, Spring Security, Spring MVC, JPA, Hibernate, REST APIs, WebClient.",
    },
    {
      title: "Primary Frontend",
      description: "Angular 14 and 19, Angular Material, lazy loading, TypeScript, RxJS, workflow dashboards, enterprise UI delivery.",
    },
    {
      title: "Architecture and Scale",
      description: "Microservices, Saga orchestration, CQRS, event-driven design, multi-tenant systems, RBAC, JWT, tracing.",
    },
    {
      title: "Delivery and Integrations",
      description: "Redis, Docker, Kubernetes, GCP, Cloud Monitoring, React, n8n, Workato, SnapLogic, automation workflows.",
    },
  ],
  profiles: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/vaibhavnirmal2001/",
      icon: "linkedin",
      meta: "network and writing",
      description: "Professional updates, backend architecture posts, and career highlights.",
      action: "Connect",
    },
    {
      label: "Medium",
      href: "https://vaibhavnirmal2001.medium.com/",
      icon: "medium",
      meta: "technical writing",
      description: "Articles on Spring Boot, microservice patterns, and distributed systems.",
      action: "Read",
    },
    {
      label: "GitHub",
      href: "https://github.com/vaibhavnirmal2001",
      icon: "github",
      meta: "60+ repos",
      description: "Code, experiments, and hands-on backend and full stack development work.",
      action: "Explore",
    },
    {
      label: "LeetCode",
      href: "https://leetcode.com/vaibhavnirmal2001/",
      icon: "leetcode",
      meta: "500+ problems",
      description: "Consistent problem solving across data structures and algorithms.",
      action: "View",
    },
    {
      label: "Stack Overflow",
      href: "https://stackoverflow.com/users/14828354/vaibhav-nirmal",
      icon: "stackoverflow",
      meta: "400+ reputation",
      description: "Community participation and knowledge sharing with developers.",
      action: "Visit",
    },
    {
      label: "GeeksforGeeks",
      href: "https://www.geeksforgeeks.org/user/vbn2001/",
      icon: "gfg",
      meta: "500+ problems",
      description: "Practice history reflecting strong consistency in core programming skills.",
      action: "Open",
    },
  ],
  achievements: [
    {
      title: "Google Cloud Professional Developer",
      copy:
        "Certified in October 2024 with hands-on experience across Cloud SQL, Kubernetes, Cloud Monitoring, Cloud Logging, ingress, and production deployments.",
    },
    {
      title: "1st Place at Siemens Energy Germany Hackathon",
      copy:
        "Won first place among 45 teams in a 48-hour challenge, contributing to Blue Altair's selection as an enterprise vendor for upcoming projects.",
    },
    {
      title: "Technical Leadership and Reviews",
      copy:
        "Served as a primary reviewer across multiple microservices, drove architectural consistency, and mentored junior developers during onboarding.",
    },
  ],
  contact: {
    title: "Let's build reliable systems and polished products.",
    body:
      "I am a Java Full Stack Engineer based in Pune, open to relocation, and interested in backend-heavy or full stack roles where distributed systems, product thinking, and production quality matter.",
    email: "vaibhavnirmal2001@gmail.com",
    phone: "+91 9511727791",
    linkedin: "https://www.linkedin.com/in/vaibhavnirmal2001/",
    github: "https://github.com/vaibhavnirmal2001",
    medium: "https://vaibhavnirmal2001.medium.com/",
  },
  contactActions: [
    { label: "Email", href: "mailto:vaibhavnirmal2001@gmail.com", icon: "email" },
    { label: "Call", href: "tel:+919511727791", icon: "phone" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/vaibhavnirmal2001/", icon: "linkedin" },
    { label: "GitHub", href: "https://github.com/vaibhavnirmal2001", icon: "github" },
    { label: "Medium", href: "https://vaibhavnirmal2001.medium.com/", icon: "medium" },
  ],
  nav: [
    { label: "Projects", href: "#projects", id: "projects" },
    { label: "Experience", href: "#experience", id: "experience" },
    { label: "Skills", href: "#systems", id: "systems" },
    { label: "Profiles", href: "#profiles", id: "profiles" },
    { label: "Contact", href: "#contact", id: "contact" },
  ],
  ticker: [
    "Java 21",
    "Spring Boot 3",
    "Angular",
    "Microservices",
    "Kafka",
    "Redis",
    "Docker",
    "Kubernetes",
    "PostgreSQL",
    "Liquibase",
    "React",
    "GCP",
    "n8n",
    "Workato",
    "SnapLogic",
    "System Design",
    "RBAC",
  ],
};
