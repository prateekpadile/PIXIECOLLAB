import React, { useState } from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Avatar,
  Tooltip,
} from '@material-tailwind/react';
import { RiDeleteBin6Line } from 'react-icons/ri'; // Import delete icon from React Icons
import axios from 'axios'; // Import axios for HTTP requests
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setProjectId } from '../features/projectSlice';
import store from '../app/store';
export function BlogCard({
  projectName,
  projectDescription,
  channelUsername,
  isComplete,
  projectId,
  fun,
  state,
  onDelete, // Add onDelete prop for handling delete action
}) {
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const cardStyle = {
    transition: 'transform 0.3s ease',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
  };

  let name;
  if (isComplete) {
    name = channelUsername;
  } else {
    name = `Confirmation Pending : ${projectId}`;
  }

  const handleDelete = async () => {
    try {
      // Send delete request to backend API
      await axios.delete('http://localhost:5501/project/delete', {
        data: { projectId }, // Pass projectId in the request body
      });
      fun(state.filter((project) => project.projectId != projectId));
      // Call onDelete callback to remove the card from UI
      // onDelete(projectId);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const nav = useNavigate();
  const dispatch = useDispatch();
  const handleCardClick = () => {
    dispatch(setProjectId(projectId));
    nav('/chat');
  };
  return (
    <Card
      className="max-w-[20rem] overflow-hidden flex flex-col h-full"
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
    >
      <CardBody className={`p-4 flex-1 ${!isComplete ? 'bg-yellow-50' : ''}`}>
        <Typography variant="h5" color="blue-gray">
          {projectName}
        </Typography>
        <Typography variant="body2" color="gray" className="mt-2 font-normal">
          {projectDescription}
        </Typography>
      </CardBody>
      <CardFooter
        className={`flex items-center justify-between p-4 ${
          !isComplete ? 'bg-yellow-50' : ''
        }`}
      >
        <div className="flex items-center -space-x-2">
          <Tooltip content={channelUsername}>
            <Avatar
              size="s"
              variant="circular"
              alt={name}
              src="https://img.freepik.com/premium-vector/vector-flat-icon-vector-stylish-man-suit-tie-with-mustache_176841-3974.jpg?w=1060"
              className="border-2 border-white hover:z-10"
            />
          </Tooltip>
        </div>
        <div className="flex items-center space-x-2">
          <Typography className="text-xs font-normal">{name}</Typography>
          <button
            className="px-3 py-2 text-xs text-gray-900 uppercase transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            onClick={handleDelete} // Call handleDelete function on click
          >
            <RiDeleteBin6Line className="inline-block h-4 w-4 align-middle" />
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default BlogCard;
