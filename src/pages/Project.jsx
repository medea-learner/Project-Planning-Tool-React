import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getUserProject,
  createUserProject,
  editUserProject,
  getProjectCategories,
  generateDescriptionSummary,
} from '../lib/apiService';
import ImageUploadPreview from '../components/ImageUploadPreview';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Project = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    priority: 'Medium',
    category: '',
    status: 'Waiting',
    images: [],
  });
  const [categories, setCategories] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false); // Loading state for AI

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      const fetchProject = async () => {
        try {
          const response = await getUserProject(id);
          setFormData(response);
        } catch (error) {
          console.error('Error fetching project:', error);
        }
      };
      fetchProject();
    }
  }, [isEditing, id]);

  useEffect(() => {
    const fetchProjectCategories = async () => {
      try {
        const response = await getProjectCategories();
        setCategories(response);
      } catch (error) {
        console.error('Error fetching project categories:', error);
      }
    };
    fetchProjectCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFormData((prevFormData) => ({
      ...prevFormData,
      images: [...prevFormData.images, ...newImages],
    }));
  };

  const handleDeleteImage = (imageToDelete) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      images: prevFormData.images.filter((image) =>
        imageToDelete.preview
          ? imageToDelete.preview !== image.preview
          : imageToDelete.id !== image.id
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await editUserProject(id, formData);
      } else {
        await createUserProject(formData);
      }
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `${isEditing ? 'Project updated' : 'Project created'} successfully.`,
      });
      if (!isEditing) {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleGenerateDescriptionSummary = async () => {
    if (!formData.description) {
      toast.error('Please introduce a description for your project');
      return;
    }
    setIsGenerating(true);
    try {
      const response = await generateDescriptionSummary({
        projectDescription: formData.description,
        projectTitle: formData.title,
        projectCategory: formData.category,
      });
      const aiDescription = response.description;
      setFormData((prev) => ({ ...prev, description: aiDescription }));
      toast.success('AI description summary generated successfully!');
    } catch (error) {
      toast.error('Failed to generate AI description summary.');
    } finally {
      setIsGenerating(false); // Hide loading state
    }
  };
  

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{isEditing ? 'Edit Project' : 'Create New Project'}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="font-medium">Description</label>
            <button
              type="button"
              onClick={handleGenerateDescriptionSummary}
              className="px-4 py-2 border border-blue-500 rounded hover:border-blue-700 text-blue-500 hover:text-blue-700"
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Summarize with AI'}
            </button>
          </div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          ></textarea>
        </div>

        <div className="flex space-x-4">
          <div>
            <label className="block mb-2 font-medium">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Trivial">Trivial</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="" disabled>Select a category</option>
            {categories.map((category, index) => (
              <option key={index} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="Waiting">Waiting</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <ImageUploadPreview
          images={formData.images}
          handleFileChange={handleFileChange}
          handleDeleteImage={handleDeleteImage}
        />

        <button
          type="submit"
          className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-700"
        >
          {isEditing ? 'Update Project' : 'Create Project'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Project;
