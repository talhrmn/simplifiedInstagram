import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ImageComponent from '@/app/components/image-component/imageComponent';
import { ImageDataContext } from '@/app/contexts/image-context/imageContext';
import { apiClient } from '@/app/utils/apiClient';

jest.mock('@/app/utils/apiClient', () => ({
  apiClient: {
    post: jest.fn()
  }
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} />;
  }
}));

describe('ImageComponent', () => {
  const mockProps = {
    image_id: 'test123',
    image_url: 'https://example.com/test.jpg',
    likes: 10,
    dislikes: 5
  };

  const mockUpdateImage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders image and interaction buttons', () => {
    render(
      <ImageDataContext.Provider value={{ imageData: [], setImageData: jest.fn(), updateImage: mockUpdateImage }}>
        <ImageComponent {...mockProps} />
      </ImageDataContext.Provider>
    );

    expect(screen.getByAltText('')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('calls like endpoint when like button is clicked', async () => {
    (apiClient.post as jest.Mock).mockResolvedValueOnce({ data: 11 });

    render(
      <ImageDataContext.Provider value={{ imageData: [], setImageData: jest.fn(), updateImage: mockUpdateImage }}>
        <ImageComponent {...mockProps} />
      </ImageDataContext.Provider>
    );

    const likeButton = screen.getByText('10').closest('button');
    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/images/test123/like');
      expect(mockUpdateImage).toHaveBeenCalledWith({ type: 'like', image_id: 'test123', likes: 11 });
    });
  });

  it('calls dislike endpoint when dislike button is clicked', async () => {
    (apiClient.post as jest.Mock).mockResolvedValueOnce({ data: 6 });

    render(
      <ImageDataContext.Provider value={{ imageData: [], setImageData: jest.fn(), updateImage: mockUpdateImage }}>
        <ImageComponent {...mockProps} />
      </ImageDataContext.Provider>
    );

    const dislikeButton = screen.getByText('5').closest('button');
    fireEvent.click(dislikeButton);
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/images/test123/dislike');
      expect(mockUpdateImage).toHaveBeenCalledWith({ type: 'dislike', image_id: 'test123', dislikes: 6 });
    });
  });

  it('handles error when liking fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (apiClient.post as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(
      <ImageDataContext.Provider value={{ imageData: [], setImageData: jest.fn(), updateImage: mockUpdateImage }}>
        <ImageComponent {...mockProps} />
      </ImageDataContext.Provider>
    );

    const likeButton = screen.getByText('10').closest('button');
    fireEvent.click(likeButton);
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to like image', expect.any(Error));
      expect(mockUpdateImage).not.toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});