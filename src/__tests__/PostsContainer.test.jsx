import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostsContainer from '../PostsContainer';
import { getPosts } from '../api.js';

jest.mock('../api.js');

const mockPosts = [
  { id: 1, title: 'Post 1', body: 'Body 1' },
  { id: 2, title: 'Post 2', body: 'Body 2' },
  { id: 3, title: 'Post 3', body: 'Body 3' },
];

describe('PostsContainer', () => {
  beforeEach(() => {
    // jest.clearAllMocks();
    jest.resetAllMocks();
    getPosts.mockResolvedValue(mockPosts);
  });

  // test('matches snapshot', () => {
  //   const { asFragment } = render(<PostsContainer />);
  //   expect(asFragment()).toMatchSnapshot();
  // });
  test('fetches and displays posts', async () => {
    render(<PostsContainer />);
    await waitFor(() => expect(getPosts).toHaveBeenCalledTimes(1));
    mockPosts.forEach((post) => {
      expect(screen.getByText(post.title)).toBeInTheDocument();
    });
  });

  test('displays error on failed fetch', async () => {
    getPosts.mockRejectedValue(new Error('Failed to load posts.'));
    render(<PostsContainer />);
    await waitFor(() =>
      expect(screen.getByText('Failed to load posts.')).toBeInTheDocument()
    );
    expect(screen.getByText('Close')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Close'));
    const modal = screen.queryByText('Failed to load posts.');
    await waitFor(() => expect(modal).not.toBeInTheDocument());
  });

  test('updates searchQuery on input change', async () => {
    render(<PostsContainer />);
    fireEvent.change(screen.getByPlaceholderText('Search posts'), {
      target: { value: 'Post 1' },
    });
    await waitFor(() =>
      expect(screen.getByDisplayValue('Post 1')).toBeInTheDocument()
    );
  });

  test('filters posts based on searchQuery', async () => {
    render(<PostsContainer />);
    fireEvent.change(screen.getByPlaceholderText('Search posts'), {
      target: { value: 'Post 1' },
    });
    await waitFor(() => {
      expect(screen.getByText('Post 1')).toBeInTheDocument();
      expect(screen.queryByText('Post 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Post 3')).not.toBeInTheDocument();
    });
  });

  test('loads more posts on button click', async () => {
    render(<PostsContainer />);
    fireEvent.click(screen.getByText('Load More'));
    await waitFor(() => expect(getPosts).toHaveBeenCalledTimes(1));
  });
});
