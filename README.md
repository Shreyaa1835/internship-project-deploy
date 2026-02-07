# Blog Post Generator with Research

---

## Project Overview

A web application that helps content creators generate comprehensive blog posts using AI-powered research and content generation. Users input a topic and keywords, and an AI agent researches the topic, creates an outline, and generates blog content with citations. The application includes features for editing, formatting, plagiarism checking, and scheduling posts for publication.

---

## Technology Stack

### Frontend
- React 19
- Vite (build tool)
- Tailwind CSS (styling)
- React Router DOM (routing)
- Axios or Fetch (API calls)
- Firebase SDK (authentication)

### Backend
- Python 3.12+
- FastAPI (REST API)
- Uvicorn (ASGI server)
- Pydantic (data validation)

### Database
- SQLite (for blog posts and metadata ONLY, NOT authentication)

### Authentication
- Firebase Authentication (email/password)
- Firebase SDK in frontend

### AI/ML
- LangChain (basic chains and agents)
- Google Gemini LLM (for content generation)
- LangChain web search tools (for research)
- Simple text processing for plagiarism checking

---
## Testing & Verification

End-to-end manual testing of the complete application flow has been completed.

📄 **Detailed testing documentation:**  
[TESTING.md](./TESTING.md)

This document includes:
- Pages & routes verification
- API endpoints audit
- Authentication & protected routes testing
- CRUD operations validation
- Error handling scenarios
- UI/UX and responsive testing

## Features

- User authentication with Firebase (signup, login, logout)
- Input topic and keywords for blog post generation
- AI agent researches topics using web search tools
- Generate blog post outline automatically
- Generate full blog post content
- Preview blog post before finalizing
- Edit and format generated content
- Add images and formatting to blog posts
- Plagiarism checking for generated content
- Save drafts of blog posts
- Schedule posts for future publishing
- View list of all blog posts
- View individual blog post details
- Delete blog posts
- Search through blog posts
- Export blog posts (markdown, HTML, or plain text)
- Landing page with app information
- Dashboard for managing blog posts

---

## Project Structure

```
blog-post-generator-with-research/
├── Backend/                    # FastAPI backend application
│   ├── main.py                 # Main backend server file
│   ├── pyproject.toml          # Python project configuration
│   ├── requirements.txt        # Python dependencies
│   ├── uv.lock                 # UV lock file
│   ├── README.md               # Backend-specific documentation
│   └── .env                    # Environment variables
│
├── Frontend/                   # React frontend application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # React entry point
│   ├── package.json            # Node.js dependencies
│   └── vite.config.js          # Vite configuration
│
├── issues/                     # Project issues (15-20 issues)
│   ├── issue-01-project-setup.md
│   ├── issue-02-landing-page-ui.md
│   └── ...
│
├── project_details.md          # Project planning document
└── PROJECT-README.md          # This file
```

---

## Issue Flow

### Foundation Phase (Issues 1-8)

**Issue #01: Project Setup**
- Sets up project structure, dependencies, and development environment
- README format with setup instructions

**Issue #02: Landing Page UI**
- Creates static landing page with Navbar, Hero, Features, Footer
- No backend interaction

**Issue #03: Signup Page UI**
- Creates static signup form
- No Firebase integration yet

**Issue #04: Login Page UI**
- Creates static login form
- No Firebase integration yet

**Issue #05: Firebase Auth Setup**
- Configures Firebase project and SDK
- Sets up authentication service

**Issue #06: Integrate Signup with Firebase**
- Connects signup form to Firebase Authentication
- Handles account creation

**Issue #07: Integrate Login with Firebase**
- Connects login form to Firebase Authentication
- Handles user authentication

**Issue #08: Dashboard UI**
- Creates protected dashboard page
- Sets up blog post list components

### Core Features Phase (Issues 9-15)

**Issue #09: Create Post Feature**
- Combined frontend+backend
- TopicForm component and POST /api/blog-posts endpoint
- Creates initial blog post record

**Issue #10: Research and Outline Generation**
- Backend + LLM integration
- LangChain agent researches topic and generates outline
- OutlineView component displays results

**Issue #11: Full Content Generation**
- Backend + LLM integration
- Generates complete blog post content from outline
- POST /api/blog-posts/:id/generate endpoint

**Issue #12: Display Blog Posts**
- Backend + frontend integration
- GET /api/blog-posts endpoint and BlogPostList component
- Shows all user's blog posts

**Issue #13: Post Detail View**
- Combined frontend+backend
- GET /api/blog-posts/:id endpoint and Post Detail page
- BlogPostView and ContentEditor components

**Issue #14: Edit and Update Feature**
- Combined frontend+backend
- PUT /api/blog-posts/:id endpoint
- ContentEditor and ActionButtons components

**Issue #15: Delete Feature**
- Combined frontend+backend
- DELETE /api/blog-posts/:id endpoint
- Delete button with confirmation

### Advanced Features Phase (Issues 16-18)

**Issue #16: Plagiarism Checking**
- Combined frontend+backend
- POST /api/blog-posts/:id/check-plagiarism endpoint
- PlagiarismChecker component

**Issue #17: Search Feature**
- Combined frontend+backend
- GET /api/blog-posts/search endpoint
- SearchBar component integration

**Issue #18: Scheduling and Export**
- Combined frontend+backend
- PUT /api/blog-posts/:id/schedule and GET /api/blog-posts/:id/export endpoints
- SchedulePicker and ExportButton components

### Final Phase (Issue 19)

**Issue #19: Final Testing**
- Complete application flow verification
- End-to-end testing documentation ([TESTING.md](./TESTING.md))
- User interaction flow documentation


---

## API Endpoints Reference

### Blog Post Management

| Method | Endpoint | Protected | Purpose | LLM Integration |
|--------|----------|-----------|---------|-----------------|
| POST | /api/blog-posts | Yes | Create new blog post (generate) | Yes |
| GET | /api/blog-posts | Yes | Get all user's blog posts | No |
| GET | /api/blog-posts/:id | Yes | Get single blog post | No |
| PUT | /api/blog-posts/:id | Yes | Update blog post content | No |
| DELETE | /api/blog-posts/:id | Yes | Delete blog post | No |

### Content Generation

| Method | Endpoint | Protected | Purpose | LLM Integration |
|--------|----------|-----------|---------|-----------------|
| POST | /api/blog-posts/:id/generate | Yes | Generate full content from outline | Yes |

### Additional Features

| Method | Endpoint | Protected | Purpose | LLM Integration |
|--------|----------|-----------|---------|-----------------|
| POST | /api/blog-posts/:id/check-plagiarism | Yes | Check content for plagiarism | Yes |
| PUT | /api/blog-posts/:id/schedule | Yes | Schedule post for publishing | No |
| PUT | /api/blog-posts/:id/publish | Yes | Mark post as published | No |
| GET | /api/blog-posts/search | Yes | Search blog posts | No |
| GET | /api/blog-posts/:id/export | Yes | Export blog post | No |

**Note:** Authentication is handled entirely by Firebase SDK in the frontend. No backend auth endpoints are needed.

---

## Frontend Pages

| Page Name | Route | Protected | Main Components |
|-----------|-------|-----------|-----------------|
| Landing | / | No | Navbar, Hero, Features, Footer |
| Signup | /signup | No | SignupForm |
| Login | /login | No | LoginForm |
| Dashboard | /dashboard | Yes | Navbar, BlogPostList, CreateButton, SearchBar |
| Create Post | /blog-posts/create | Yes | TopicForm, OutlineView, ContentEditor |
| Post Detail | /blog-posts/:id | Yes | BlogPostView, ContentEditor, PlagiarismChecker, SchedulePicker, ActionButtons, ExportButton |

---

## Components

| Component Name | Used On Pages | Purpose |
|----------------|---------------|---------|
| Navbar | All pages | Navigation header |
| Hero | Landing | Hero section with CTA |
| Features | Landing | Feature showcase |
| Footer | All pages | Footer with links |
| SignupForm | Signup | Registration form |
| LoginForm | Login | Login form |
| BlogPostList | Dashboard | Display all blog posts |
| BlogPostCard | Dashboard | Single blog post card |
| CreateButton | Dashboard | Button to create new post |
| SearchBar | Dashboard | Search interface |
| TopicForm | Create Post | Form for topic/keywords |
| OutlineView | Create Post | Display generated outline |
| ContentEditor | Create Post, Post Detail | Rich text editor |
| BlogPostView | Post Detail | Display full blog post |
| ActionButtons | Post Detail | Save, publish, delete buttons |
| PlagiarismChecker | Post Detail | Plagiarism check interface |
| SchedulePicker | Post Detail | Date/time picker for scheduling |
| ExportButton | Post Detail | Export functionality |
| LoadingSpinner | Multiple | Loading indicator |
| ErrorMessage | Multiple | Error display |

---

## Database Schema (High-Level)

### blog_posts
- Purpose: Store blog post data
- Essential fields: identifier, user reference, title, content, outline, status (draft/published), timestamps
- Students decide: exact field names, data types, additional fields

### scheduled_posts (Optional)
- Purpose: Store scheduled publishing dates
- Essential fields: post reference, scheduled date/time
- Students decide: structure and implementation

**Note:** User authentication is handled by Firebase, so user data is NOT stored in SQLite database. Only the Firebase user ID is stored as a reference in blog_posts table.

---

## User Journey

1. **First Visit:** User lands on Landing page, sees features, clicks "Sign Up"
2. **Registration:** Fills signup form, Firebase creates account, redirects to login
3. **Login:** Enters credentials, Firebase authenticates, redirects to Dashboard
4. **Create Blog Post:** Clicks "Create New Post", enters topic/keywords, AI researches and generates outline, user approves, full content is generated
5. **Manage Posts:** Views all posts on Dashboard, searches, clicks to view details, edits, deletes, exports
6. **Publishing:** User marks post as published, status updates

---

## Development Workflow

1. Start with Issue #01 (Project Setup)
2. Complete Foundation issues (#02-08)
3. Implement Core Features (#09-15)
4. Add Advanced Features (#16-18)
5. Complete Final Testing (#19)

Each issue builds upon previous issues, following a logical progression from setup to advanced features.

---

## Important Notes

- Firebase handles ALL authentication (no backend auth logic)
- SQLite handles ALL data storage (no PostgreSQL/MongoDB)
- LangChain + LLM handles ALL AI features (no OCR, no specialized libraries)
- Students design their own database schemas
- All issues follow high-level guidance (WHAT to build, not HOW)
- Combined frontend+backend issues reduce total count to 19
- Each issue is completable in 60-120 minutes

---

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [LangChain Documentation](https://python.langchain.com/)
- [Google Generative AI Documentation](https://ai.google.dev/docs)

---

## License

This is a template project for educational purposes.
