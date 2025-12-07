// Using placeholder data for UI development.
// Replace with actual API calls when the backend is ready.

const generateMockBooks = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    itemId: `item-${i + 1}`,
    title: `The Great Controversy ${i + 1}`,
    authors: ['Ellen G. White'],
    coverImageUrl: `https://picsum.photos/seed/${i + 1}/200/300`,
    description: 'A book about the cosmic conflict between good and evil.',
    format: 'eBook',
  }));
};

export const mockContinueReading = [
  {
    ...generateMockBooks(1)[0],
    itemId: 'continue-1',
    progress: 0.65, // 65%
  },
];

export const mockNewArrivals = generateMockBooks(5).map(b => ({...b, itemId: `new-${b.itemId}`}));
export const mockTrending = generateMockBooks(5).map(b => ({...b, itemId: `trending-${b.itemId}`})).reverse();
export const mockFeatured = generateMockBooks(5).map(b => ({...b, itemId: `featured-${b.itemId}`})).slice(2, 5);

export const getHomeScreenData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        continueReading: mockContinueReading,
        newArrivals: mockNewArrivals,
        trending: mockTrending,
        featured: mockFeatured,
      });
    }, 500); // Simulate network delay
  });
};
