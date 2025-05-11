import React, { createContext, useState, useContext } from 'react';
import { contentAPI, uploadAPI } from '../services/api';

const ContentContext = createContext();

export function useContent() {
  return useContext(ContentContext);
}

export function ContentProvider({ children }) {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchContents = async (filters = {}) => {
    try {
      setLoading(true);
      setError('');
      const response = await contentAPI.getAll(filters);
      setContents(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch contents');
      console.error('Error fetching contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const createContent = async (contentData, file) => {
    try {
      setLoading(true);
      setError('');

      let fileUrl = null;
      if (file) {
        const uploadResponse = await uploadAPI.uploadFile(file);
        fileUrl = uploadResponse.data.url;
      }

      const response = await contentAPI.create({
        ...contentData,
        fileUrl
      });

      setContents(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create content');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (id, contentData, file) => {
    try {
      setLoading(true);
      setError('');

      let fileUrl = contentData.fileUrl;
      if (file) {
        const uploadResponse = await uploadAPI.uploadFile(file);
        fileUrl = uploadResponse.data.url;
      }

      const response = await contentAPI.update(id, {
        ...contentData,
        fileUrl
      });

      setContents(prev =>
        prev.map(content =>
          content.id === id ? response.data : content
        )
      );

      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update content');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteContent = async (id) => {
    try {
      setLoading(true);
      setError('');
      await contentAPI.delete(id);
      setContents(prev => prev.filter(content => content.id !== id));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete content');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    contents,
    loading,
    error,
    fetchContents,
    createContent,
    updateContent,
    deleteContent
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
} 