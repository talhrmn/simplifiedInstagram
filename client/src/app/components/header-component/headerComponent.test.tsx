import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HeaderComponent } from '@/app/components/header-component/headerComponent';
import { ImageDataContext } from '@/app/contexts/image-context/imageContext';

global.URL.createObjectURL = jest.fn(() => 'mock-url');

describe('HeaderComponent', () => {
  const mockImageData = [
    { image_id: 'img1', image_url: 'https://example.com/img1.jpg', likes: 10, dislikes: 5 },
    { image_id: 'img2', image_url: 'https://example.com/img2.jpg', likes: 15, dislikes: 3 }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and export button', () => {
    render(
      <ImageDataContext.Provider value={{ imageData: mockImageData, setImageData: jest.fn(), updateImage: jest.fn() }}>
        <HeaderComponent />
      </ImageDataContext.Provider>
    );

    expect(screen.getByText('Welcome to Simplified Instagram')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  it('exports data as CSV when export button is clicked', () => {
    // Mock DOM methods
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

    render(
      <ImageDataContext.Provider value={{ imageData: mockImageData, setImageData: jest.fn(), updateImage: jest.fn() }}>
        <HeaderComponent />
      </ImageDataContext.Provider>
    );

    const exportButton = screen.getByText('Export').closest('button');
    fireEvent.click(exportButton);

    expect(mockLink.setAttribute).toHaveBeenCalledWith('href', 'mock-url');
    expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'simplified_instagram_data.csv');
    expect(mockAppendChild).toHaveBeenCalled();
    expect(mockLinkClick).toHaveBeenCalled();
    expect(mockRemoveChild).toHaveBeenCalled();
  });

  it('handles export errors', () => {
    // Mock console.error and alert
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    // Force an error during export
    URL.createObjectURL = jest.fn().mockImplementation(() => {
      throw new Error('Export failed');
    });

    render(
      <ImageDataContext.Provider value={{ imageData: mockImageData, setImageData: jest.fn(), updateImage: jest.fn() }}>
        <HeaderComponent />
      </ImageDataContext.Provider>
    );

    const exportButton = screen.getByText('Export').closest('button');
    fireEvent.click(exportButton);

    expect(consoleSpy).toHaveBeenCalledWith('Failed to export data:', expect.any(Error));
    expect(alertSpy).toHaveBeenCalledWith('Failed to export data. Please try again.');

    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });
});