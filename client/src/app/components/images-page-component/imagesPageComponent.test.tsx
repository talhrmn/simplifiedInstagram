import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ImagesPageComponent from '@/app/components/images-page-component/imagePageComponent';
import { ImageDataContext } from '@/app/contexts/image-context/imageContext';
import { apiClient } from '@/app/utils/apiClient';

// Mock the API client
jest.mock('@/app/utils/apiClient', () => ({
  apiClient: {
    get: jest.fn()
  }
}));

// Mock the ImageComponent
jest.mock('@/app/components/image-component/imageComponent', () => ({
  __esModule: true,
  default: ({ image_id, image_url, likes, dislikes }) => (
    <div data-testid={`image-${image_id}`}>
      <p>URL: {image_url}</p>
      <p>Likes: {likes}</p>
      <p>Dislikes: {dislikes}</p>
    </div>
  )
}));

describe('ImagesPageComponent', () => {
  const mockImageData = [
    { image_id: 'img1', image_url: 'https://example.com/img1.jpg', likes: 10, dislikes: 5 },
    { image_id: 'img2', image_url: 'https://example.com/img2.jpg', likes: 15, dislikes: 3 }
  ];

  const mockSetImageData = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', () => {
    render(
      <ImageDataContext.Provider value={{ imageData: [], setImageData: mockSetImageData, updateImage: jest.fn() }}>
        <ImagesPageComponent />
      </ImageDataContext.Provider>
    );

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('displays images after loading', async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({
      data: mockImageData
    });

    render(
      <ImageDataContext.Provider value={{ imageData: mockImageData, setImageData: mockSetImageData, updateImage: jest.fn() }}>
        <ImagesPageComponent />
      </ImageDataContext.Provider>
    );

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/images');
      expect(mockSetImageData).toHaveBeenCalledWith(mockImageData);
      expect(screen.getByTestId('image-img1')).toBeInTheDocument();
      expect(screen.getByTestId('image-img2')).toBeInTheDocument();
    });
  });

  it('displays error message when API fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (apiClient.get as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(
      <ImageDataContext.Provider value={{ imageData: [], setImageData: mockSetImageData, updateImage: jest.fn() }}>
        <ImagesPageComponent />
      </ImageDataContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch image data: ', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('displays message when no images are available', async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: [] });

    render(
      <ImageDataContext.Provider value={{ imageData: [], setImageData: mockSetImageData, updateImage: jest.fn() }}>
        <ImagesPageComponent />
      </ImageDataContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('No Images To Display')).toBeInTheDocument();
    });
  });
});