import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '@/app/page';
import { apiClient } from './utils/apiClient';

// Mock the API client
jest.mock('./utils/apiClient', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn()
  }
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} />;
  }
}));

describe('Integration Test - Home Page', () => {
  const mockImageData = [
    { image_id: 'img1', image_url: 'https://example.com/img1.jpg', likes: 10, dislikes: 5 },
    { image_id: 'img2', image_url: 'https://example.com/img2.jpg', likes: 15, dislikes: 3 }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockImageData });
    (apiClient.post as jest.Mock).mockImplementation((url) => {
      if (url.includes('like')) {
        return Promise.resolve({ data: 11 });
      } else if (url.includes('dislike')) {
        return Promise.resolve({ data: 6 });
      }
      return Promise.resolve({ data: null });
    });
  });

  it('renders the complete application flow', async () => {
    render(<Home />);

    // Initially shows loading state
    expect(screen.getByText('Loading')).toBeInTheDocument();

    // Wait for images to load
    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/images');
      expect(screen.getByText('Welcome to Simplified Instagram')).toBeInTheDocument();
    });

    // Test like functionality
    const likeButtons = await screen.findAllByText(/[0-9]+/);
    fireEvent.click(likeButtons[1]); // Click on the like button

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith(expect.stringContaining('like'));
    });

    // Test export functionality
    // Mock DOM methods for export
    const mockAppendChild = jest.fn();
    const mockRemoveChild = jest.fn();
    const mockLinkClick = jest.fn();

    document.body.appendChild = mockAppendChild;
    document.body.removeChild = mockRemoveChild;

    const mockLink = {
      setAttribute: jest.fn(),
      click: mockLinkClick
    };

    document.createElement = jest.fn().mockImplementation((tag) => {
      if (tag === 'a') return mockLink;
      return document.createElement(tag);
    });

    global.URL.createObjectURL = jest.fn(() => 'mock-url');

    const exportButton = screen.getByText('Export').closest('button');
    fireEvent.click(exportButton);

    expect(mockLink.setAttribute).toHaveBeenCalledWith('href', 'mock-url');
    expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'simplified_instagram_data.csv');
    expect(mockAppendChild).toHaveBeenCalled();
    expect(mockLinkClick).toHaveBeenCalled();
    expect(mockRemoveChild).toHaveBeenCalled();
  });
});