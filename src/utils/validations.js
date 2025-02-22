

export const validateEditProfileData = (req) => {
    const allowEditProfileFields = ['firstName', 'lastName',  'age', 'bio', 'location', 'skills', 'photoUrl'];
    const update = Object.keys(req.body).every((key) => allowEditProfileFields.includes(key))
    return update; 
};



