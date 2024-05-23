import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginPost } from '../api/memberApi';
import {getCookie, removeCookie, setCookie, setViewCountCookie} from '../util/cookieUtil';

const initState = {
  email: '',
};

const loadMemberCookie = () => {
  const memberInfo = getCookie('member');

  //닉네임 처리
  if (memberInfo && memberInfo.nickname) {
    memberInfo.nickname = decodeURIComponent(memberInfo.nickname);
  }

  return memberInfo;
};

export const loginPostAsync = createAsyncThunk('loginPostAsync', (param) => {
  return loginPost(param);
});

const loginSlice = createSlice({
  name: 'LoginSlice',
  initialState: loadMemberCookie() || initState,
  reducers: {
    login: (state, action) => {
      console.log('#################### loginSlice.....');
      console.log('action.payload = ', action.payload);

      const data = action.payload;
      return { email: data.email };
    },
    logout: (state, action) => {
      console.log('################## logout.....');
      removeCookie('member');
      console.log('###### loginSlice - createSlice removeCookie - boardViewCounts');
      removeCookie('boardViewCount');
      return { ...initState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginPostAsync.fulfilled, (state, action) => {
        console.log('###### loginSlice - extraReducers - fulfilled # start');
        console.log('action = ', action);
        const payload = action.payload;
        if (!payload.error) {
          setCookie('member', JSON.stringify(payload), 1);
        }
        console.log('###### loginSlice - extraReducers - fulfilled # setCookie - boardViewCounts');
        setViewCountCookie('boardViewCount', JSON.stringify([]));
        console.log('###### loginSlice - extraReducers - fulfilled # end');
        return payload;
      })
      .addCase(loginPostAsync.pending, (state, action) => {
        console.log('##### pending');
      })
      .addCase(loginPostAsync.rejected, (state, action) => {
        console.log('rejected');
      });
  },
});

export const { login, logout } = loginSlice.actions;
export default loginSlice.reducer;
