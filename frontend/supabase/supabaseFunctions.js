import { supabase } from "./supabaseClient";

export async function uploadImageToSupabase(folder, file, index = 0){
    if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed");
        return '';
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File size too large, upload images less than 5mb");
        return '';
    }
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${index}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;
    const bucketName = import.meta.env.VITE_SUPABASE_BUCKET_NAME

    const { error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

    if (error) {
        console.error('Upload error:', error.message);
        return '';
        }
    
    const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
    
    return data.publicUrl;
}

export async function deleteImageFromSupabase(url) {
    const bucketName = import.meta.env.VITE_SUPABASE_BUCKET_NAME

    // Extract the file path from the URL
    const path = url.split(`/${bucketName}/`)[1];
    console.log(url, path)
    const { data, error } = await supabase.storage
        .from(bucketName)
        .remove([path]);

    return { data, error }
}