import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchUserDetails, updateUser } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {

  const defaultProfileImage = 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f464.svg';
  
  const dispatch = useDispatch();
  const {user} = useSelector((state)=>state.auth);

  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        profileImage: user.profileImage || '',
      });
      setImagePreview(user.profileImage || defaultProfileImage);
    }
  }, [user]);

  const [formData,setFormData] = useState({
    name:user?.name||'',
    email:user?.email||'',
    bio:user?.bio || '',
    profileImage:user?.profileImage || '',
  });

  const handleSubmit = (e)=>{
    e.preventDefault();
    const updatedData = new FormData();
    Object.keys(formData).forEach((key)=>updatedData.append(key,formData[key]));

    dispatch(updateUser(formData)).then((response)=>{
      if (response.payload?.success) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(response.payload?.error || "Update failed");
      }
    })
    setIsEditing(false);
  }


  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(user?.profileImage||defaultProfileImage);
  const fileInputRef = useRef(null);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev,[name]: value}));
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {

      setFormData(prev => ({...prev,profileImage: file}));

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleImageError = () => {
    setImagePreview(defaultProfileImage);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const displayImage = imagePreview || (user.profileImage 
    ? URL.createObjectURL(user.profileImage) 
    : defaultProfileImage);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 h-32 relative">
        <p onClick={()=>navigate('/home')} className="text-3xl w-10 h-10 flex items-center text-white justify-center hover:bg-sky-500 rounded-full transition duration-200 cursor-pointer">
          <b>{'<'}</b>
        </p>
          {isEditing ? (
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                form="profile-form"
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-4 right-4 bg-white text-blue-600 px-4 py-2 rounded-md shadow"
            >
              Edit Profile
            </button>
          )}
        </div>
        

        <div className="flex justify-center -mt-16">
          <div className="relative">
            <img src={imagePreview} alt="Profile" onError={handleImageError} className="w-32 h-32 rounded-full border-4 border-white object-cover bg-gray-100"
            />
            {isEditing && (
              <button onClick={triggerFileInput} className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 shadow-md"
                title="Upload new photo" >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*"
                  className="hidden" />
              </button>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <form id="profile-form"  onSubmit={handleSubmit}>            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    {isEditing ? (
                      <input type="text" name="name" value={formData.name} onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md" />
                    ) : (
                      <p>{user.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    {isEditing ? (
                      <input type="email" name="email" value={formData.email} onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"/>
                    ) : (
                      <p>{user.email}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-4">About Me</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  {isEditing ? (
                    <textarea name="bio" value={formData.bio} onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md h-32" />
                  ) : (
                    <p className="text-gray-700">{user.bio}</p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;