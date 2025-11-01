import {createSlice} from '@reduxjs/toolkit';
const initialState = {
    currUser : null,
    isEditor : true,
    isLogin : false,
}
const userSlice = createSlice({
    name:"currUser",
    initialState,
    reducers:{
      setCurrUser:(state)=>{
        //API call
        return state;
      },
      setIsEditor:(state,action)=>{
        return {...state, isEditor:action.payload}
      },
      increase:(state,action)=>{
        const diff = action.payload
        return {...state, streak:state.streak+diff}
      },
      decrease:(state)=>{
        return {...state, streak:state.streak-1}
      },
      intialize:(state, action)=>{
        return action.payload
      },
    }
})

export const {setCurrUser,setIsEditor,increase,decrease,intialize} = userSlice.actions; 
export default userSlice.reducer;   


