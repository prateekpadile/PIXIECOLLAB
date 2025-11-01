const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = mongoose.Schema(
  {
    projectName: {
      type: String,
    },
    projectDescription: {
      type: String,
    },
    projectId: {
      type: String,
    },
    editorUsername: {
      type: String,
      required: true,
    },
    channelUsername: {
      type: String,
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
  },
  { minimize: false }
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
