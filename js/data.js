(function () {
  const profile = {
    name: "Muhammad Behram Hassan",
    title: "Junior Data Scientist",
    location: "Gujranwala, Punjab, Pakistan",
    summary: "Software Engineering graduate working as a Junior Data Scientist at SoftCodec. The role covers Python data analysis, SQL, API development, data pipelines, and machine learning workflows. Project work includes generative AI, RAG, NLP, deep learning, and computer vision.",
    education: {
      degree: "Bachelor of Science in Software Engineering",
      school: "GIFT University, Gujranwala",
      period: "2021 – 2025",
      cgpa: "3.54/4.00",
      earlier: [
        { qualification: "Intermediate Pre-Engineering", school: "GIFT College, Gujranwala", period: "2019 – 2021", result: "765/1100 (69.54%)" },
        { qualification: "Matriculation with Science", school: "Government High School Aroop, Gujranwala", period: "2017 – 2019", result: "874/1100 (79.45%)" }
      ]
    },
    photo: "Behram_img.jpg",
    specialties: [
      "Artificial Intelligence",
      "Machine Learning",
      "Computer Vision",
      "Natural Language Processing",
      "Generative AI",
      "Data Analysis",
      "Software Development"
    ]
  };

  const experience = [
    {
      role: "Junior Data Scientist",
      org: "SoftCodec",
      dates: "28 November 2025 – Present",
      location: "Gujranwala, Pakistan",
      mode: "On-site",
      current: true,
      duties: [
        "Analyze data in Python and prepare it for reporting and model work.",
        "Manage SQL databases used by data and product workflows.",
        "Develop and integrate APIs.",
        "Build and maintain data pipelines.",
        "Support machine learning workflows.",
        "Test AI features used in data-driven products."
      ]
    }
  ];

  const projects = [
    {
      id: "beautygenie",
      title: "BeautyGenie AI-Powered Virtual Makeup",
      repo: "https://github.com/behra527/Skin-Tone-Classification-model",
      repoName: "Skin-Tone-Classification-model",
      categories: ["ai", "cv"],
      tech: ["Python", "TensorFlow", "PyTorch", "OpenCV", "VGG16", "GANs", "React Native"],
      description: "Deep learning skin-tone classification using VGG16, MTCNN face detection, and a Flask API.",
      badges: ["Python 3.10+", "Flask Backend", "TensorFlow Deep Learning", "Model VGG16", "Accuracy 98%", "License MIT"],
      note: "The public repository is the skin-tone classification model from this project."
    },
    {
      id: "car-damage",
      title: "Car Damage Detection System",
      repo: "https://github.com/behra527/car-damage-detector-yolov8",
      repoName: "car-damage-detector-yolov8",
      categories: ["ai", "cv"],
      tech: ["Python", "YOLOv8", "OpenCV", "Flask"],
      description: "Flask web app that uses a YOLOv8 model to detect and classify car damage from an uploaded image.",
      badges: ["Python 3.10+", "Flask 3.1.0", "Ultralytics YOLOv8", "License MIT"]
    },
    {
      id: "bughound",
      title: "BugHound-AI Software Issue Diagnosis",
      repo: "https://github.com/behra527/AUTONOMOUS-AGENTIC-AI-SOFTWARE-ISSUE-DIAGNOSIS-PATCH-RESOLUTION-SYSTEM",
      repoName: "AUTONOMOUS-AGENTIC-AI-SOFTWARE-ISSUE-DIAGNOSIS-PATCH-RESOLUTION-SYSTEM",
      categories: ["ai", "automation"],
      tech: ["Python", "FastAPI", "React", "TypeScript", "PostgreSQL", "Docker"],
      description: "Evidence-driven platform that investigates software issues, analyzes Python repositories, and speeds up debugging.",
      badges: ["Python 3.13", "FastAPI Backend", "React Frontend", "TypeScript", "PostgreSQL", "Docker", "AI Integration", "Status Active Development"]
    },
    {
      id: "medical-rag",
      title: "Medical RAG Clinical Guideline Assistant",
      repo: "https://github.com/behra527/medical-rag-clinical-guideline-assistant",
      repoName: "medical-rag-clinical-guideline-assistant",
      categories: ["ai", "nlp"],
      tech: ["Python", "RAG", "Embeddings", "LLMs"],
      description: "Clinical guideline RAG chatbot with hybrid retrieval, page-level citations, and claim checks.",
      badges: ["Python 3.11", "FastAPI", "SQLite FTS5", "LLM OpenRouter", "Hybrid RAG", "Project Research"]
    },
    {
      id: "audio",
      title: "Audio Category Classifier",
      repo: "https://github.com/behra527/audio-category-classifier",
      repoName: "audio-category-classifier",
      categories: ["ai", "nlp"],
      tech: ["Python", "Whisper", "spaCy", "Pandas", "Flask"],
      description: "Speech-to-text tool that uses Whisper and spaCy to transcribe audio and sort it into categories.",
      badges: ["Python 3.10+", "Flask Backend", "SpaCy NLP", "OpenAI Whisper", "License MIT"]
    }
  ];

  const projectCategories = [
    { id: "all", label: "All Projects" },
    { id: "ai", label: "Artificial Intelligence" },
    { id: "cv", label: "Computer Vision" },
    { id: "nlp", label: "NLP and Generative AI" },
    { id: "web", label: "Web and Mobile Applications" },
    { id: "automation", label: "Automation" }
  ];

  const extraRepos = [
    { name: "Skin-Tone-Classification-model", html_url: "https://github.com/behra527/Skin-Tone-Classification-model" },
    { name: "car-damage-detector-yolov8", html_url: "https://github.com/behra527/car-damage-detector-yolov8" },
    { name: "AUTONOMOUS-AGENTIC-AI-SOFTWARE-ISSUE-DIAGNOSIS-PATCH-RESOLUTION-SYSTEM", html_url: "https://github.com/behra527/AUTONOMOUS-AGENTIC-AI-SOFTWARE-ISSUE-DIAGNOSIS-PATCH-RESOLUTION-SYSTEM" },
    { name: "medical-rag-clinical-guideline-assistant", html_url: "https://github.com/behra527/medical-rag-clinical-guideline-assistant" },
    { name: "audio-category-classifier", html_url: "https://github.com/behra527/audio-category-classifier" }
  ];

  const skills = [
    {
      id: "aiml",
      label: "Artificial Intelligence and Machine Learning",
      items: ["Artificial Intelligence", "Machine Learning", "Deep Learning", "Generative AI", "Neural Networks", "Model Evaluation", "Feature Engineering"]
    },
    {
      id: "cv",
      label: "Computer Vision",
      items: ["OpenCV", "YOLO", "YOLOv8", "Object Detection", "Image Processing", "GANs", "GFPGAN", "Image Enhancement"]
    },
    {
      id: "nlp",
      label: "NLP and LLMs",
      items: ["NLP", "BERT", "Transformers", "Hugging Face", "LangChain", "Embeddings", "Sentiment Analysis", "Whisper"]
    },
    {
      id: "lang",
      label: "Programming",
      items: ["Python", "JavaScript", "Java", "C++", "SQL", "HTML", "CSS"]
    },
    {
      id: "frameworks",
      label: "Frameworks and APIs",
      items: ["TensorFlow", "PyTorch", "Scikit-learn", "Flask", "React", "Node.js", "Express.js", "React Native"]
    },
    {
      id: "data",
      label: "Data and Tools",
      items: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "Power BI", "Tableau", "PostgreSQL", "MongoDB", "Firebase", "Git", "GitHub"]
    }
  ];

  const certifications = [
    { title: "Google AI Essentials Specialization", issuer: "Google", date: "September 2026", id: "18I626PR6QZ9", url: "https://www.coursera.org/account/accomplishments/specialization/18I626PR6QZ9", group: "Google" },
    { title: "A SIEM Tool Bootcamp", issuer: "Thinkcloudly", date: "October 2025", id: "TC-112025-P8C7Y31-13048", url: "https://thinkcloudly.com/cert-verification/?cert=TC-112025-P8C7Y31-13048", group: "Thinkcloudly" },
    { title: "Generative AI Application Developer Certificate (Top Performer)", issuer: "ULEFUSA", date: "January 2026", expires: "February 2031", id: "f615c0c10df0e25b", url: "https://quiz.ideagist.com/ideagist-certificate?cert_hash=f615c0c10df0e25b", group: "ULEFUSA" },
    { title: "Ethical Hacking Essentials (EHE)", issuer: "EC-Council", date: "June 2025", id: "ZMJ4G0W0KDV6", url: "https://www.coursera.org/account/accomplishments/records/ZMJ4G0W0KDV6", group: "EC-Council" },
    { title: "IBM Generative AI Engineering", issuer: "IBM", date: null, id: "H2YIE68TZXVR", url: "https://www.coursera.org/account/accomplishments/professional-cert/certificate/H2YIE68TZXVR", group: "IBM" },
    { title: "Fundamentals of AI Agents Using RAG and LangChain", issuer: "IBM", date: "May 2025", id: "6FHXL1TVRKCM", url: "https://www.coursera.org/account/accomplishments/records/6FHXL1TVRKCM", group: "IBM" },
    { title: "Generative AI Advance Fine-Tuning for LLMs", issuer: "IBM", date: "May 2025", id: "01Z3S1NQ0ZWG", url: "https://www.coursera.org/account/accomplishments/records/01Z3S1NQ0ZWG", group: "IBM" },
    { title: "Generative AI Engineering and Fine-Tuning Transformers", issuer: "IBM", date: "April 2025", id: "QGG6L760LFCW", url: "https://www.coursera.org/account/accomplishments/records/QGG6L760LFCW", group: "IBM" },
    { title: "Generative AI Language Modeling with Transformers", issuer: "IBM", date: "April 2025", id: "DLCJZCYJJE0V", url: "https://www.coursera.org/account/accomplishments/records/DLCJZCYJJE0V", group: "IBM" },
    { title: "Gen AI Foundational Models for NLP & Language Understanding", issuer: "IBM", date: "April 2025", id: "W6E86F46T8NV", url: "https://www.coursera.org/account/accomplishments/records/W6E86F46T8NV", group: "IBM" },
    { title: "Generative AI and LLMs: Architecture and Data Preparation", issuer: "IBM", date: "March 2025", id: "12SIKS6XQ9WD", url: "https://www.coursera.org/account/accomplishments/records/12SIKS6XQ9WD", group: "IBM" },
    { title: "Introduction to Deep Learning & Neural Networks with Keras", issuer: "IBM", date: "March 2025", id: "5HD1JWLNCJP8", url: "https://www.coursera.org/account/accomplishments/records/5HD1JWLNCJP8", group: "IBM" },
    { title: "Machine Learning with Python", issuer: "IBM", date: "March 2025", id: "SNIU8YTQDQCC", url: "https://www.coursera.org/account/accomplishments/records/SNIU8YTQDQCC", group: "IBM" },
    { title: "Data Analysis with Python", issuer: "IBM", date: "March 2025", id: "TLN3U73Z7XR3", url: "https://www.coursera.org/account/accomplishments/records/TLN3U73Z7XR3", group: "IBM" },
    { title: "Building Generative AI-Powered Applications with Python", issuer: "IBM", date: "March 2025", id: "KTBZS398E6VT", url: "https://www.coursera.org/account/accomplishments/records/KTBZS398E6VT", group: "IBM" },
    { title: "Python for Data Science, AI & Development", issuer: "IBM", date: "March 2025", id: "N6HL5M0RCE1C", url: "https://www.coursera.org/account/accomplishments/records/N6HL5M0RCE1C", group: "IBM" },
    { title: "Generative AI: Prompt Engineering Basics", issuer: "IBM", date: "March 2025", id: "M8UPO2A2AP35", url: "https://www.coursera.org/account/accomplishments/records/M8UPO2A2AP35", group: "IBM" },
    { title: "Introduction to Artificial Intelligence (AI)", issuer: "IBM", date: "February 2025", id: "ZRQOGCKFULIG", url: "https://www.coursera.org/account/accomplishments/records/ZRQOGCKFULIG", group: "IBM" },
    { title: "Generative AI: Introduction and Applications", issuer: "IBM", date: "March 2025", id: "5EC3UPBCJ9CP", url: "https://www.coursera.org/account/accomplishments/records/5EC3UPBCJ9CP", group: "IBM" }
  ];

  const contact = {
    email: "behramhassanm@gmail.com",
    phone: "+923156589047",
    phoneDisplay: "+92 315 658 9047",
    linkedin: "https://www.linkedin.com/in/muhammadbehramhassan/",
    github: "https://github.com/behra527",
    cv: "CV.pdf",
    cvName: "Muhammad_Behram_Hassan_CV.pdf",
    formspree: "https://formspree.io/f/mldoeyae"
  };

  const openrouter = {
    api: "https://openrouter.ai/api/v1/chat/completions",
    key: "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",
    model: "openai/gpt-4o-mini"
  };

  const emailjs = {
    serviceID: "service_yltnyjj",
    templateID: "template_cf5ad0y",
    autoReplyTemplateID: "template_h1vukka",
    publicKey: "Seb_d1_iVLJ7c-RzC"
  };

  const desktopIcons = [
    { id: "computer", label: "My Computer", icon: "computer" },
    { id: "about", label: "About Me", icon: "user" },
    { id: "resume", label: "My Resume", icon: "resume" },
    { id: "projects", label: "My Projects", icon: "folder" },
    { id: "github", label: "GitHub", icon: "github" },
    { id: "skills", label: "Technical Skills", icon: "skills" },
    { id: "certifications", label: "Certifications", icon: "cert" },
    { id: "contact", label: "Contact Me", icon: "mail" },
    { id: "recycle", label: "Recycle Bin", icon: "recycle" }
  ];

  const startPrograms = [
    { id: "about", label: "My Profile", icon: "user" },
    { id: "resume", label: "Resume", icon: "resume" },
    { id: "projects", label: "Projects", icon: "folder" },
    { id: "github", label: "GitHub", icon: "github" },
    { id: "skills", label: "Technical Skills", icon: "skills" },
    { id: "certifications", label: "Certifications", icon: "cert" },
    { id: "contact", label: "Contact", icon: "mail" }
  ];

  const allPrograms = [
    { id: "help", label: "Help and Support", icon: "info" },
    { id: "terminal", label: "Command Prompt", icon: "terminal" },
    { id: "assistant", label: "Behram AI Assistant", icon: "assistant" },
    { id: "recycle", label: "Recycle Bin", icon: "recycle" },
    { id: "computer", label: "My Computer", icon: "computer" }
  ];

  window.XPData = {
    profile: profile,
    experience: experience,
    projects: projects,
    projectCategories: projectCategories,
    extraRepos: extraRepos,
    skills: skills,
    certifications: certifications,
    contact: contact,
    emailjs: emailjs,
    openrouter: openrouter,
    desktopIcons: desktopIcons,
    startPrograms: startPrograms,
    allPrograms: allPrograms,
    githubUser: "behra527",
    githubApi: "https://api.github.com/users/behra527/repos?per_page=100&sort=updated"
  };
})();
