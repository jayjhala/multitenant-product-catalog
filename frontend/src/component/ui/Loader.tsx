// src/components/ui/loader.tsx
const Loader = () => {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-t-transparent border-blue-600" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  };
  
  export default Loader;
  