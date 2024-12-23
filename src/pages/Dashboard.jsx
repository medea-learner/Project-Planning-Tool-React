import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getUserProjects,
  deleteUserProject,
  exportProjectPdf,
  sendProjectEmail
} from '../lib/apiService';
import Swal from 'sweetalert2';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getUserProjects();
        setProjects(response);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleEditProject = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteUserProject(projectId);
      setProjects(projects.filter((project) => project.id !== projectId));
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error Deleting Project'
      });
    }
  };

  const handleExportPdf = async (projectId) => {
    Swal.fire({
      title: 'Generating Pdf...',
      text: 'Please wait while we generate the pdf file.',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    try {
      const pdfBlob = await exportProjectPdf(projectId);
  
      // Create a URL for the blob
      const url = window.URL.createObjectURL(
        new Blob([pdfBlob], { type: 'application/pdf' })
      );
  
      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `project_${projectId}.pdf`);
  
      // Append link to body, trigger click, and remove link
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      Swal.fire({
        icon: 'success',
        title: 'Exported',
        text: 'Project has been exported as PDF and downloaded.',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Export Failed',
        text: 'Error exporting project as PDF.',
      });
    }
  };

  const handleSendEmail = (projectId) => {
    Swal.fire({
      title: 'Send Email',
      text: 'Enter the recipient email address:',
      input: 'email',
      inputPlaceholder: 'Enter recipient email',
      showCancelButton: true,
      confirmButtonText: 'Next',
      cancelButtonText: 'Cancel',
      preConfirm: (email) => {
        if (!email) {
          Swal.showValidationMessage('Email is required!');
          return false;
        }
        return email;
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const recipientEmail = result.value;
  
        Swal.fire({
          title: 'Choose what to send:',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Send Description Only',
          cancelButtonText: 'Send Description with PDF',
        }).then(async (emailChoice) => {
          if (emailChoice.isConfirmed) {
            // Show loading spinner while sending the email
            Swal.fire({
              title: 'Sending Email...',
              text: 'Please wait while we send the email.',
              allowOutsideClick: false, // Prevent user from closing the alert
              showConfirmButton: false, // Hide the confirm button
              didOpen: () => {
                Swal.showLoading();
              }
            });
  
            try {
              // Send only the description
              await sendProjectEmail(projectId, recipientEmail, false);
              Swal.fire({
                icon: 'success',
                title: 'Email Sent',
                text: 'The project description has been sent via email.',
              });
            } catch (error) {
              Swal.fire({
                icon: 'error',
                title: 'Failed to Send Email',
                text: 'There was an error sending the email.',
              });
            }
          } else if (emailChoice.dismiss === Swal.DismissReason.cancel) {
            // Show loading spinner while sending the email
            Swal.fire({
              title: 'Sending Email...',
              text: 'Please wait while we send the email.',
              allowOutsideClick: false, // Prevent user from closing the alert
              showConfirmButton: false, // Hide the confirm button
              didOpen: () => {
                Swal.showLoading(); // Show the loading spinner
              }
            });
  
            try {
              // Send description along with PDF
              await sendProjectEmail(projectId, recipientEmail, true);
              Swal.fire({
                icon: 'success',
                title: 'Email Sent',
                text: 'The project description along with the PDF has been sent via email.',
              });
            } catch (error) {
              Swal.fire({
                icon: 'error',
                title: 'Failed to Send Email',
                text: 'There was an error sending the email.',
              });
            }
          }
        });
      }
    });
  };
  

  return (
    <div className="p-6">
      {projects.length > 0 ? (
        <>
        <h1 className="text-2xl font-bold mb-6">Projects</h1>
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-center">Title</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Start Date</th>
              <th className="border border-gray-300 px-4 py-2 text-center">End Date</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Priority</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Status</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td className="border border-gray-300 px-4 py-2 text-center">{project.title}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{project.startDate}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{project.endDate}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{project.priority}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{project.status}</td>
                <td className="border border-gray-300 px-4 py-2 text-center flex gap-2 justify-center">
                  <button
                    onClick={() => handleEditProject(project.id)}
                    className="px-3 py-1 border border-blue-500  rounded hover:border-blue-700"
                    title='Edit'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="px-3 py-1 border border-red-500 rounded hover:border-red-700"
                    title='Delete'
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleExportPdf(project.id)}
                    className="px-3 py-1 border border-green-500 rounded hover:border-green-700"
                    title='Export as PDF'
                  >
                    Export as PDF
                  </button>
                  <button
                    onClick={() => handleSendEmail(project.id)}
                    className="px-3 py-1 border border-yellow-500 rounded hover:border-yellow-700"
                    title='Send as Email'
                  >
                    Send as Email
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </>
      ) : (
        <p className='text-center'>No projects found. Create a new project to get started.</p>
      )}
    </div>
  );
}
