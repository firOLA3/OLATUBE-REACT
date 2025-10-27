export const API_KEY = 'AIzaSyCeDEI8O9Fs6a9CEDz8kP0lnn71qbIv_f8';

//sweet function that takes the views data and coverts it into "thousands like k"
export const value_converter = (value) =>{
    if(value>1000000)
    {
        return Math.floor(value/1000000)+"M";
    }
    else if(value>=1000)
    {
        return Math.floor(value/1000)+"K";
    }
    else{
        return value;
    }
}