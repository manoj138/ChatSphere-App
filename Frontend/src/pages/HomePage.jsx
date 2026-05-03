const HomePage = () => {
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
             {/* Sidebar & Chat components will go here */}
             <div className="flex-1 flex flex-center items-center justify-center">
                <h1 className="text-2xl font-bold">Welcome to ChatSphere!</h1>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
