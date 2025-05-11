const mockData = [
    { id: 1, title: "Post 1", description: "First post", published: true },
    { id: 2, title: "Post 2", description: "Second post", published: false },
    { id: 3, title: "Post 3", description: "Third post", published: true },
  ];
  
  // Named export
  export function getPublishedContents() {
    return mockData.filter(item => item.published);
  }
  
  export default mockData;
  