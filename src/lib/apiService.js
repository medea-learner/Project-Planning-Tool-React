import axios from 'axios';
import Cookies from 'js-cookie';
import { handleServerError, transformToCamelCase } from './utils.js';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const getUserProjects = async () => {
  const accessToken = Cookies.get('accessToken');

  if (!accessToken) {
    throw new Error('No access token found');
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/projects/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status !== 200) {
      throw new Error('Failed to fetch projects');
    }

    return transformToCamelCase(response.data);
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const getUserProject = async (id) => {
    const accessToken = Cookies.get('accessToken');

    if (!accessToken) {
      throw new Error('No access token found');
    }
  
  const response = await axios.get(`${API_BASE_URL}/projects/${id}/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status !== 200) {
    throw new Error('Failed to fetch project');
  }
  return transformToCamelCase(response.data);
};

export const createUserProject = async (data) => {
    const accessToken = Cookies.get('accessToken');

    if (!accessToken) {
      throw new Error('No access token found');
    }

    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("start_date", data.startDate);
    formData.append("end_date", data.endDate);
    formData.append("category", data.category);
    formData.append("priority", data.priority);
    formData.append("status", data.status);

    if (data.images && data.images.length > 0) {
      formData.append("existing_images", JSON.stringify(data.images.filter(image => image.id).map(image => image.id)));
      data.images.filter(image => !image.id).forEach((image, index) => {
        formData.append(`uploaded_images[${index}]`, image.file);
      });
    }
    try {
      const response = await axios.post(
          `${API_BASE_URL}/projects/`, 
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
      );
      return transformToCamelCase(response.data);
    } catch (error) {
      handleServerError(error, 'Failed to create project');
    }
    
};

export const editUserProject = async (id, data) => {
  const accessToken = Cookies.get('accessToken');
  if (!accessToken) {
      throw new Error('No access token found');
  }

  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("start_date", data.startDate);
  formData.append("end_date", data.endDate);
  formData.append("category", data.category);
  formData.append("priority", data.priority);
  formData.append("status", data.status);

  if (data.images && data.images.length > 0) {
    formData.append("existing_images", JSON.stringify(data.images.filter(image => image.id).map(image => image.id)));
    data.images.filter(image => !image.id).forEach((image, index) => {
      formData.append(`uploaded_images[${index}]`, image.file);
    });
  }

  try {
      const response = await axios.patch(
          `${API_BASE_URL}/projects/${id}/`,
          formData,
          {
              headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "multipart/form-data",
              },
          }
      );

      if (response.status !== 200) {
          throw new Error('Failed to edit project');
      }

      return transformToCamelCase(response.data);
  } catch (error) {
      handleServerError(error, 'An error occurred while editing the project');
  }
};


export const deleteUserProject = async (id) => {
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) {
        throw new Error('No access token found');
    }
    const response = await axios.delete(`${API_BASE_URL}/projects/${id}/`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (response.status !== 204) {
        throw new Error('Failed to delete project');
    }
    return transformToCamelCase(response.data);
};

export const getProjectCategories = async () => {
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) {
        throw new Error('No access token found');
    }
    const response = await axios.get(`${API_BASE_URL}/project-categories/`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (response.status !== 200) {
        throw new Error('Failed to fetch categories');
    }
    return transformToCamelCase(response.data);
};

export const exportProjectPdf = async (projectId) => {
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) {
        throw new Error('No access token found');
    }
    const response = await axios.get(`${API_BASE_URL}/export-pdf/${projectId}/`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            responseType: 'blob',
        }
    );
    return response.data;
};

export const sendProjectEmail = async (projectId, recipient, includePdf) => {
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) {
        throw new Error('No access token found');
    }
    const response = await axios.get(
        `${API_BASE_URL}/send-email/${projectId}/?email=${recipient}&include_pdf=${includePdf ? "true" : "false"}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    return transformToCamelCase(response.data);
};

export const generateDescriptionSummary = async ({ projectDescription, projectTitle, projectCategory }) => {
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) {
        throw new Error('No access token found');
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/generate-description-summary/`, {
        project_description: projectDescription,
        project_title: projectTitle,
        project_category: projectCategory,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      handleServerError(error, 'Failed to generate description. Please try again.');
    }
};
