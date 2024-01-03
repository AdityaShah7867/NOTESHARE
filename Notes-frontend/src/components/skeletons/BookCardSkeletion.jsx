
import "../rhome.css";


const BookCardSkeletion = () => {
  return (
    <div className="flex flex-row md:flex-row sm:flex-row flex-wrap ml-4 lg:ml-4">
      <div className="post-card mx-2 mt-6 skeleton-loader">
        <div className="avatar skeleton-loader"></div>
        <div className="flex">
          <span className="title text-white mr-10 skeleton-loader"></span>
          <span className="mt-2 skeleton-loader">Subject: Loading...</span>
        </div>

        <span className="datetime skeleton-loader">Loading...</span>

        <div className="image-preview skeleton-loader">
          <div className="skeleton-loader border border-black h-40"></div>
        </div>
        <div className="comment-like skeleton-loader">
          <span>
            <i className="fa-regular fa-heart fa-beat fa-xl mx-2"></i> Loading...
          </span>
          <span>
            <i className="fa-regular fa-comment fa-xl mx-2"></i> Loading...
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookCardSkeletion;