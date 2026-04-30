const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['task_assigned', 'project_invitation', 'task_updated', 'comment_added'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedProject: {
      type: mongoose.Schema.ObjectId,
      ref: 'Project',
    },
    relatedTask: {
      type: mongoose.Schema.ObjectId,
      ref: 'Task',
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
