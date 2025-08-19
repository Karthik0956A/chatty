

  <h1>💬 Realtime Chat App</h1>
  <p>
    A <b>real-time chat application</b> built with <b>MERN stack</b> (MongoDB, Express.js, React, Node.js) 
    and <b>Socket.IO</b> for instant messaging.<br>
    It supports <b>user authentication, online/offline status, image messaging with compression, and search functionality</b>.
  </p>

  <h2>🚀 Features</h2>
  <ul>
    <li>🔐 <b>Authentication</b> – Secure signup/login with JWT.</li>
    <li>💬 <b>Realtime Messaging</b> – Powered by <b>Socket.IO</b>.</li>
    <li>🟢 <b>Online/Offline Status</b> – See who’s currently online.</li>
    <li>📷 <b>Image Sharing</b> – Send compressed images (50KB optimized).</li>
    <li>🔍 <b>User Search</b> – Quickly find people to chat with.</li>
    <li>📱 <b>Responsive UI</b> – Works seamlessly across devices.</li>
  </ul>

  <h2>🛠️ Tech Stack</h2>
  <h3>Frontend:</h3>
  <ul>
    <li>React (Vite)</li>
    <li>Zustand (state management)</li>
    <li>Axios</li>
    <li>TailwindCSS</li>
  </ul>

  <h3>Backend:</h3>
  <ul>
    <li>Node.js</li>
    <li>Express.js</li>
    <li>MongoDB (Mongoose)</li>
    <li>Socket.IO</li>
  </ul>

  <h3>Deployment:</h3>
  <p>Render.com</p>

  <h2>⚙️ Installation</h2>
  <p>Clone the repository:</p>
  <pre><code>git clone https://github.com/your-username/your-repo.git
cd your-repo</code></pre>

  <p>Install dependencies for both frontend and backend:</p>
  <pre><code># Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install</code></pre>

  <h2>▶️ Running Locally</h2>
  <h3>Start Backend</h3>
  <pre><code>cd backend
npm run dev</code></pre>

  <h3>Start Frontend</h3>
  <pre><code>cd frontend
npm run dev</code></pre>

  <p>Open your browser at: <b>http://localhost:5173</b></p>

  <h2>🌍 Deployment</h2>
  <p>
    This app is designed to run seamlessly on <b>Render.com</b>.
    Make sure to:
  </p>
  <ol>
    <li>Push code to GitHub.</li>
    <li>Connect Render to your repository.</li>
    <li>Add required <b>Environment Variables</b> (see below).</li>
    <li>Deploy frontend & backend separately.</li>
  </ol>

  <h2>🔑 Environment Variables</h2>
  <p>Create a <code>.env</code> file in both <b>backend</b> and <b>frontend</b> directories:</p>

  <h3>Backend <code>.env</code></h3>
  <pre><code>PORT=....
MONGO_URI=...............
JWT_SECRET=.............
NODE_ENV=development(locally) /production(deployment)
CLOUDINARY_CLOUD_NAME=.....................
CLOUDINARY_API_KEY=....................
CLOUDINARY_API_SECRET=...........................
</code></pre>

 

  <h2>✅ TODO / Future Improvements</h2>
  <ul>
    <li>Add <b>typing indicators</b></li>
    <li>Add <b>read receipts</b></li>
    <li>Add <b>group chats</b></li>
    <li>Improve <b>file sharing (PDF, docs, etc.)</b></li>
  </ul>

</body>
</html>
