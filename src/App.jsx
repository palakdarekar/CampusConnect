import { useEffect, useState } from "react";
import "./index.css";

function App() {
  const [activePage, setActivePage] = useState("home");
  const [upcomingFlipped, setUpcomingFlipped] = useState(false);
  const [flippedCard, setFlippedCard] = useState(null);

  const [selectedEvent, setSelectedEvent] = useState("");
  const [studentName, setStudentName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [registrations, setRegistrations] = useState([]);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  // ================= FORGOT PASSWORD =================
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // ================= FETCH STUDENT REGISTRATIONS =================
  const fetchRegistrations = async () => {
    if (!loggedInUser) {
      setRegistrations([]);
      return;
    }

    try {
      const url = `https://campus-connect-newp.vercel.app/api/registrations/user?email=${encodeURIComponent(
        loggedInUser.email
      )}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch registrations");
      }

      const data = await response.json();
      setRegistrations(data);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    }
  };

  // ================= LOGIN USER EFFECT =================
  useEffect(() => {
    if (loggedInUser) {
      fetchRegistrations();
    } else {
      setRegistrations([]);
    }
  }, [loggedInUser]);

  // ================= EVENTS =================
  const events = [
    {
      id: 1,
      name: "Annual College Fest",
      category: "CULTURAL",
      date: "25 September 2026",
      time: "10:00 AM",
      venue: "College Auditorium",
      description:
        "A celebration of talent, creativity, music and unforgettable campus moments.",
    },
    {
      id: 2,
      name: "Tech Fest",
      category: "TECHNOLOGY",
      date: "28 September 2026",
      time: "11:00 AM",
      venue: "Innovation Hall",
      description:
        "Explore technology, innovation, exciting challenges and creative ideas.",
    },
    {
      id: 3,
      name: "Sports Day",
      category: "SPORTS",
      date: "30 September 2026",
      time: "9:00 AM",
      venue: "College Ground",
      description:
        "Compete, connect and celebrate teamwork and the spirit of sports.",
    },
    {
      id: 4,
      name: "Cultural Fest",
      category: "CULTURAL",
      date: "2 October 2026",
      time: "10:00 AM",
      venue: "College Auditorium",
      description:
        "Celebrate music, dance, art, creativity and the vibrant spirit of campus life.",
    },
  ];

  // ================= OPEN REGISTRATION =================
  const openRegistration = (eventName) => {
    if (!loggedInUser) {
      alert("Please login before registering for an event.");
      setActivePage("login");
      return;
    }

    setSelectedEvent(eventName);
    setStudentName(loggedInUser.name);
    setEmail(loggedInUser.email);
    setActivePage("register");
  };

  // ================= EVENT REGISTRATION =================
  const handleRegistration = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://campus-connect-newp.vercel.app/api/registrations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentName: studentName,
            email: email,
            department: department,
            eventName: selectedEvent,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();

      alert(`Successfully registered for ${selectedEvent}!`);

      setStudentName("");
      setEmail("");
      setDepartment("");
      setSelectedEvent("");
      setActivePage("registrations");

      setTimeout(() => {
        fetchRegistrations();
      }, 0);
    } catch (error) {
      console.error(error);
      alert("Registration failed. Please try again.");
    }
  };

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      alert("Please enter email and password.");
      return;
    }

    try {
      const response = await fetch(
        "https://campus-connect-newp.vercel.app/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginEmail,
            password: loginPassword,
          }),
        }
      );

      const data = await response.json();

      if (data.message === "Login successful") {
        const user = {
          name: data.name,
          email: data.email,
        };

        setLoggedInUser(user);

        alert(`Login successful! Welcome ${data.name}.`);

        setLoginPassword("");
        setActivePage("home");
      } else {
        alert(data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to connect to the server. Please try again.");
    }
  };

  // ================= SIGNUP =================
  const handleSignup = async (e) => {
    e.preventDefault();

    if (
      !signupName ||
      !signupEmail ||
      !signupPassword ||
      !signupConfirmPassword
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        "https://campus-connect-newp.vercel.app/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: signupName,
            email: signupEmail,
            password: signupPassword,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Account creation failed");
      }

      alert("Account created successfully! Please login.");

      setLoginEmail(signupEmail);
      setLoginPassword("");
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
      setSignupConfirmPassword("");

      setActivePage("login");
    } catch (error) {
      console.error("Signup error:", error);
      alert("Account creation failed. Please try again.");
    }
  };

  // ================= FORGOT PASSWORD =================
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!resetEmail || !newPassword || !confirmNewPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        "https://campus-connect-newp.vercel.app/api/users/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: resetEmail,
            newPassword: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (data.message === "Password reset successfully.") {
        alert(
          "Password reset successfully! You can now login with your new password."
        );

        setLoginEmail(resetEmail);
        setLoginPassword("");

        setResetEmail("");
        setNewPassword("");
        setConfirmNewPassword("");

        setActivePage("login");
      } else {
        alert(data.message || "Password reset failed.");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      alert(
        "Unable to connect to the server. Please try again."
      );
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    setLoggedInUser(null);
    setRegistrations([]);
    setLoginEmail("");
    setLoginPassword("");
    setActivePage("home");

    alert("Logged out successfully.");
  };

  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}
      <nav className="navbar">

        <div className="logo">
          Campus<span>Connect</span>
        </div>

        <div className="nav-links">

          <a
            className={activePage === "home" ? "active" : ""}
            onClick={() => setActivePage("home")}
          >
            Home
          </a>

          <a
            className={activePage === "events" ? "active" : ""}
            onClick={() => setActivePage("events")}
          >
            Events
          </a>

          <a
            className={activePage === "about" ? "active" : ""}
            onClick={() => setActivePage("about")}
          >
            About
          </a>

          {!loggedInUser && (
            <button
              className={`login-btn ${
                activePage === "login" ? "active" : ""
              }`}
              onClick={() => setActivePage("login")}
            >
              Login
            </button>
          )}

          {loggedInUser && (
            <>
              <button
                className={`login-btn ${
                  activePage === "registrations"
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setActivePage("registrations");
                  fetchRegistrations();
                }}
              >
                My Registrations
              </button>

              <span className="logged-user">
                Hi, {loggedInUser.name}
              </span>

              <button
                className="login-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}

        </div>
      </nav>

      {/* ================= HOME ================= */}
      {activePage === "home" && (
        <>
          <section className="college-hero" id="home">

            <div className="college-overlay"></div>

            <div className="hero-content">

              <p className="college-name">
                NOVA CREST COLLEGE
              </p>

              <p className="presents">
                Presents
              </p>

              <h1>
                EVORIA
              </h1>

              <p className="tagline">
                Where Campus Comes Alive.
              </p>

              <button
                className="discover-btn"
                onClick={() => setActivePage("events")}
              >
                Discover Events ↓
              </button>

            </div>
          </section>

          <section className="upcoming-section">

            <div className="section-heading">

              <p className="section-label">
                ✦ WHAT'S HAPPENING
              </p>

              <h2>
                Upcoming <span>Events</span>
              </h2>

              <p>
                Flip the card to discover what's happening on campus.
              </p>

            </div>

            <div
              className={`flashcard-container ${
                upcomingFlipped ? "flipped" : ""
              }`}
              onClick={() =>
                setUpcomingFlipped(!upcomingFlipped)
              }
            >

              <div className="flashcard">

                {/* FRONT */}
                <div className="flashcard-face flashcard-front">

                  <div className="front-decoration">
                    ✦
                  </div>

                  <p className="card-small-title">
                    NOVA CREST COLLEGE
                  </p>

                  <h2>
                    Upcoming
                    <br />
                    Events
                  </h2>

                  <p className="flip-hint">
                    Click to flip ↻
                  </p>

                </div>

                {/* BACK */}
                <div className="flashcard-face flashcard-back">

                  <p className="card-small-title">
                    EVORIA • 2026
                  </p>

                  <h2>
                    What's Coming
                  </h2>

                  <div className="event-list">

                    {events.map((event) => (
                      <div
                        className="event-list-item"
                        key={event.id}
                      >
                        <span className="event-number">
                          0{event.id}
                        </span>

                        <span>
                          {event.name}
                        </span>
                      </div>
                    ))}

                  </div>

                  <p className="flip-hint">
                    Click to flip ↻
                  </p>

                </div>

              </div>
            </div>

          </section>
        </>
      )}

      {/* ================= EVENTS ================= */}
      {activePage === "events" && (
        <section className="events-section" id="events">

          <div className="section-heading">

            <p className="section-label">
              ✦ EXPLORE
            </p>

            <h2>
              Find Your <span>Event</span>
            </h2>

            <p>
              Every event has a story. Flip a card to discover more.
            </p>

          </div>

          <div className="event-card-grid">

            {events.map((event) => (
              <div
                className={`event-flip-container ${
                  flippedCard === event.id ? "flipped" : ""
                }`}
                key={event.id}
                onClick={() =>
                  setFlippedCard(
                    flippedCard === event.id
                      ? null
                      : event.id
                  )
                }
              >

                <div className="event-flip-card">

                  {/* EVENT FRONT */}
                  <div className="event-face event-front">

                    <span className="event-category">
                      {event.category}
                    </span>

                    <div className="event-number-large">
                      0{event.id}
                    </div>

                    <h3>
                      {event.name}
                    </h3>

                    <p>
                      Flip to explore →
                    </p>

                  </div>

                  {/* EVENT BACK */}
                  <div className="event-face event-back">

                    <span className="event-category">
                      {event.category}
                    </span>

                    <h3>
                      {event.name}
                    </h3>

                    <p className="event-description">
                      {event.description}
                    </p>

                    <div className="event-details">

                      <p>
                        📅 {event.date}
                      </p>

                      <p>
                        ⏰ {event.time}
                      </p>

                      <p>
                        📍 {event.venue}
                      </p>

                    </div>

                    <button
                      className="register-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openRegistration(event.name);
                      }}
                    >
                      Register Now →
                    </button>

                  </div>

                </div>
              </div>
            ))}

          </div>
        </section>
      )}

      {/* ================= ABOUT ================= */}
      {activePage === "about" && (
        <section className="info-section" id="about">

          <div className="info-content">

            <p className="section-label">
              ✦ ABOUT EVORIA
            </p>

            <h2>
              More than an event.
              <br />
              <span>
                It's a campus experience.
              </span>
            </h2>

            <p>
              EVORIA brings students together through cultural,
              technological, creative and sporting events. Discover
              something new, meet your campus community and make
              memories along the way.
            </p>

          </div>

          <div className="info-boxes">

            <div className="info-box">

              <span>01</span>

              <h3>
                Discover
              </h3>

              <p>
                Find events that match your interests.
              </p>

            </div>

            <div className="info-box">

              <span>02</span>

              <h3>
                Connect
              </h3>

              <p>
                Meet students and become part of campus life.
              </p>

            </div>

            <div className="info-box">

              <span>03</span>

              <h3>
                Participate
              </h3>

              <p>
                Register and experience your favourite events.
              </p>

            </div>

          </div>

        </section>
      )}

      {/* ================= LOGIN ================= */}
      {activePage === "login" && (
        <section className="registration-section">

          <div className="section-heading">

            <p className="section-label">
              ✦ WELCOME BACK
            </p>

            <h2>
              Student <span>Login</span>
            </h2>

            <p>
              Login to access your EVORIA event registrations.
            </p>

          </div>

          <form
            className="registration-form"
            onSubmit={handleLogin}
          >

            <div className="form-group">

              <label>
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={loginEmail}
                onChange={(e) =>
                  setLoginEmail(e.target.value)
                }
                required
              />

            </div>

            <div className="form-group">

              <label>
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) =>
                  setLoginPassword(e.target.value)
                }
                required
              />

            </div>

            {/* FORGOT PASSWORD */}
            <button
              type="button"
              className="login-switch-btn"
              onClick={() => {
                setResetEmail(loginEmail);
                setActivePage("forgot-password");
              }}
            >
              Forgot Password?
            </button>

            <button
              type="submit"
              className="register-btn"
            >
              Login →
            </button>

            <button
              type="button"
              className="login-switch-btn"
              onClick={() => setActivePage("signup")}
            >
              Don't have an account? Create one
            </button>

          </form>
        </section>
      )}

      {/* ================= FORGOT PASSWORD ================= */}
      {activePage === "forgot-password" && (
        <section className="registration-section">

          <div className="section-heading">

            <p className="section-label">
              ✦ ACCOUNT RECOVERY
            </p>

            <h2>
              Reset Your <span>Password</span>
            </h2>

            <p>
              Enter your registered email and create a new password.
            </p>

          </div>

          <form
            className="registration-form"
            onSubmit={handleForgotPassword}
          >

            <div className="form-group">

              <label>
                Registered Email
              </label>

              <input
                type="email"
                placeholder="Enter your registered email"
                value={resetEmail}
                onChange={(e) =>
                  setResetEmail(e.target.value)
                }
                required
              />

            </div>

            <div className="form-group">

              <label>
                New Password
              </label>

              <input
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                required
              />

            </div>

            <div className="form-group">

              <label>
                Confirm New Password
              </label>

              <input
                type="password"
                placeholder="Confirm your new password"
                value={confirmNewPassword}
                onChange={(e) =>
                  setConfirmNewPassword(e.target.value)
                }
                required
              />

            </div>

            <button
              type="submit"
              className="register-btn"
            >
              Reset Password →
            </button>

            <button
              type="button"
              className="login-switch-btn"
              onClick={() => {
                setResetEmail("");
                setNewPassword("");
                setConfirmNewPassword("");
                setActivePage("login");
              }}
            >
              ← Back to Login
            </button>

          </form>
        </section>
      )}

      {/* ================= SIGN UP ================= */}
      {activePage === "signup" && (
        <section className="registration-section">

          <div className="section-heading">

            <p className="section-label">
              ✦ JOIN EVORIA
            </p>

            <h2>
              Create <span>Account</span>
            </h2>

            <p>
              Create your student account to register for campus events.
            </p>

          </div>

          <form
            className="registration-form"
            onSubmit={handleSignup}
          >

            <div className="form-group">

              <label>
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={signupName}
                onChange={(e) =>
                  setSignupName(e.target.value)
                }
                required
              />

            </div>

            <div className="form-group">

              <label>
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={signupEmail}
                onChange={(e) =>
                  setSignupEmail(e.target.value)
                }
                required
              />

            </div>

            <div className="form-group">

              <label>
                Password
              </label>

              <input
                type="password"
                placeholder="Create a password"
                value={signupPassword}
                onChange={(e) =>
                  setSignupPassword(e.target.value)
                }
                required
              />

            </div>

            <div className="form-group">

              <label>
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm your password"
                value={signupConfirmPassword}
                onChange={(e) =>
                  setSignupConfirmPassword(e.target.value)
                }
                required
              />

            </div>

            <button
              type="submit"
              className="register-btn"
            >
              Create Account →
            </button>

            <button
              type="button"
              className="login-switch-btn"
              onClick={() => setActivePage("login")}
            >
              Already have an account? Login
            </button>

          </form>
        </section>
      )}

      {/* ================= EVENT REGISTRATION ================= */}
      {activePage === "register" && (
        <section className="registration-section">

          <div className="section-heading">

            <p className="section-label">
              ✦ JOIN EVORIA
            </p>

            <h2>
              Event <span>Registration</span>
            </h2>

            <p>
              Register for your selected campus event.
            </p>

          </div>

          <form
            className="registration-form"
            onSubmit={handleRegistration}
          >

            <div className="form-group">

              <label>
                Student Name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={studentName}
                onChange={(e) =>
                  setStudentName(e.target.value)
                }
                required
              />

            </div>

            <div className="form-group">

              <label>
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </div>

            <div className="form-group">

              <label>
                Department
              </label>

              <input
                type="text"
                placeholder="Enter your department"
                value={department}
                onChange={(e) =>
                  setDepartment(e.target.value)
                }
                required
              />

            </div>

            <div className="form-group">

              <label>
                Selected Event
              </label>

              <input
                type="text"
                value={selectedEvent}
                readOnly
              />

            </div>

            <button
              type="submit"
              className="register-btn"
            >
              Complete Registration →
            </button>

          </form>
        </section>
      )}

      {/* ================= MY REGISTRATIONS ================= */}
      {activePage === "registrations" && (
        <section className="my-registrations">

          {!loggedInUser ? (

            <div className="no-registrations">

              <h2>
                🔐 Please Login
              </h2>

              <p>
                Please login to view your registrations.
              </p>

              <button
                className="register-btn"
                onClick={() => setActivePage("login")}
              >
                Login →
              </button>

            </div>

          ) : (

            <>

              <div className="section-heading">

                <p className="section-label">
                  ✦ YOUR EVENTS
                </p>

                <h2>
                  My <span>Registrations</span>
                </h2>

                <p>
                  Keep track of the events you've registered for.
                </p>

              </div>

              {registrations.length === 0 ? (

                <p className="no-registrations">
                  No registrations found.
                </p>

              ) : (

                <div className="registration-list">

                  {registrations.map((registration) => (

                    <div
                      className="registration-card"
                      key={registration.id}
                    >

                      <span className="registration-label">
                        EVORIA • 2026
                      </span>

                      <h3>
                        {registration.eventName}
                      </h3>

                      <div className="registration-details">

                        <p>
                          <strong>Student</strong>
                          {registration.studentName}
                        </p>

                        <p>
                          <strong>Email</strong>
                          {registration.email}
                        </p>

                        <p>
                          <strong>Department</strong>
                          {registration.department}
                        </p>

                        <p>
                          <strong>Registration ID</strong>
                          #{registration.id}
                        </p>

                      </div>

                      <div className="registration-status">
                        Registered ✓
                      </div>

                    </div>

                  ))}

                </div>
              )}

            </>
          )}

        </section>
      )}

      {/* ================= FOOTER ================= */}
      <footer>

        <h3>
          EVORIA
        </h3>

        <p>
          Where Campus Comes Alive.
        </p>

        <div className="footer-line"></div>

        <small>
          © 2026 Nova Crest College • Campus Event Management System
        </small>

      </footer>

    </div>
  );
}

export default App;