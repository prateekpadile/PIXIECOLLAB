# PixieColab

## Overview
PixieColab is a MERN stack application designed to solve a common challenge faced by vloggers: unreliable internet connections during video uploads. By providing a secure and efficient platform, PixieColab ensures that vloggers can seamlessly upload videos to their YouTube channels without compromising their credentials. The application fosters collaboration between vloggers and their editors, streamlining the content creation and upload process.

---

## Problem Statement
Uploading high-quality videos to YouTube requires a stable internet connection, which is not always available, especially for vloggers working in remote or inconsistent network environments. Editors, on the other hand, are assumed to have access to reliable internet connections. This assumption forms the foundation of PixieColab, where editors play a key role in uploading videos on behalf of vloggers. 

While the platform primarily focuses on vloggers, it can be extended to benefit other communities facing similar challenges, such as educators, content creators, or businesses in regions with poor internet connectivity.

PixieColab addresses these challenges by:

1. **Facilitating Secure Collaboration**: Editors can upload videos on behalf of vloggers without requiring access to their credentials.
2. **Ensuring Timely Uploads**: The platform minimizes delays caused by poor internet connectivity on the vlogger’s side.
3. **Preserving Control**: Vloggers retain full control over their content and YouTube accounts.

---

## Key Features
- **Google Authentication (GAuth)**: Secure authentication and authorization using YouTube API.
- **Role-based Access**: Separate interfaces and permissions for vloggers and editors.
- **Video Review Process**: Editors upload drafts that vloggers can review before finalizing uploads.
- **Queue Management**: Handles uploads in a queue to avoid conflicts and optimize the process.
- **Real-time Status Updates**: Provides progress tracking for video uploads.

---

## How to Set Up

### Prerequisites
- Node.js (version 14 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/pixiecolab.git
   cd pixiecolab
   ```

2. **Install Dependencies**:
   Navigate to the `backend` and `frontend` directories separately and install dependencies:
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. **Configure Environment Variables**:
   - Create a `.env` file in the `backend` directory.
   - Add the following variables:
     ```env
     PORT=5000
     MONGO_URI=<your_mongodb_connection_string>
     GOOGLE_CLIENT_ID=<your_google_client_id>
     GOOGLE_CLIENT_SECRET=<your_google_client_secret>
     JWT_SECRET=<your_jwt_secret>
     ```

4. **Run the Application**:
   - Start the backend server:
     ```bash
     cd backend
     npm run dev
     ```
   - Start the frontend server:
     ```bash
     cd frontend
     npm start
     ```

5. **Access the Application**:
   Open your browser and navigate to `http://localhost:3000`.

---

## Usage

1. **Sign In**:
   - Vloggers and editors sign in using Google Authentication.

2. **Assign Roles**:
   - Vloggers can invite editors to their projects.

3. **Upload Workflow**:
   - Editors upload videos to the vlogger’s project.
   - Vloggers review the uploaded videos.
   - Approved videos are uploaded directly to the vlogger’s YouTube channel.

4. **Track Progress**:
   - Both vloggers and editors can monitor the upload status in real time.

---

## Future Scope
- **Error Handling and Resilience**: Implement robust error handling for failed uploads and retries.
- **Mobile Application**: Develop a companion mobile app for on-the-go management.
- **Integration with Other Platforms**: Extend support to platforms like Vimeo and Dailymotion.
- **Enhanced Security**: Add multi-factor authentication for added security.
- **Analytics Dashboard**: Provide insights on upload performance and audience engagement.
- **Team Collaboration**: Allow multiple editors to collaborate on the same project.

---

## Contributing
Contributions are welcome! If you’d like to contribute, please:
1. Fork the repository.
2. Create a feature branch.
3. Submit a pull request.

---

## Contact
For queries or support, please reach out to [arman.wankhede2003@gmail.com].
