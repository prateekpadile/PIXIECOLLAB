const Project = require('../Models/Project');

const secretFunction = async (editor, channel) => {
  let projectId = editor + channel;
  const projectArray = await Project.find({
    $and: [{ editorUsername: editor, channelUsername: channel }],
  });
  projectId += projectArray.length;
  return projectId;
};

const addProject = async (req, res) => {
  try {
    const { projectName, projectDescription, channel, editor } = req.body;

    // Generate a unique project ID (you can use a library like shortid or UUID)
    const projectId = await secretFunction(editor, channel); // Implement this function

    // Create new project instance
    const newProject = new Project({
      projectName,
      projectDescription,
      projectId,
      editorUsername: editor,
      channelUsername: channel,
    });

    // Save project to database
    await newProject.save();

    res.status(201).json(newProject); // Respond with the created project
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error });
  }
};

const joinProject = async (req, res) => {
  try {
    const { projectId } = req.body;

    // Find the project in the database
    const project = await Project.findOne({ projectId });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    // Check if the project is already completed
    if (project.isComplete) {
      return res.status(400).json({ error: 'Project is already completed' });
    }

    // Update the project to mark it as completed
    const updatedProject = await Project.updateOne(
      { projectId },
      { $set: { isComplete: true } },
      { new: true } // This option returns the updated document
    );

    // Return the updated project details
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error('Error joining project:', error);
    res.status(500).json({ error: 'Error joining project' });
  }
};

const getProjects = async (req, res) => {
  const { editor, channel } = req.body;
  try {
    if (editor) {
      const projects = await Project.find({ editorUsername: editor });
      res.status(200).json({ data: projects, ok: true });
    } else {
      const projects = await Project.find({ channelUsername: channel });
      res.status(200).json({ data: projects, ok: true });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ data: 'Failed to Load', ok: false });
  }
};

const getByIdProject = async (req, res) => {
  const { projectId } = req.body;
  try {
    const project = await Project.findOne({ projectId: projectId });
    res.status(200).json({ data: project, ok: true });
  } catch (err) {
    console.log(err);
    res.status(400).json({ data: 'Failed to Load', ok: false });
  }
};

const deleteProject = async (req, res) => {
  const { projectId } = req.body;
  try {
    await Project.deleteOne({ projectId: projectId });
    res.status(200).json({ data: 'Deleted', ok: true });
  } catch (err) {
    console.log(err);
    res.status(400).json({ data: 'Failed to Load', ok: false });
  }
};
module.exports = {
  addProject,
  getProjects,
  deleteProject,
  joinProject,
  getByIdProject,
};
