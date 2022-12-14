import Home from '@/pages/Home/Home';
import PlayersProRandom from '@/pages/Home/Content/PlayersProRandom';

// import SignIn from '@/pages/Auth/SignIn';
// import SignUp from '@/pages/Auth/SignUp';
// import ForgotPassword from '@/pages/Auth/SignIn/ForgotPassword';
import Profile from '@/pages/Profile';
import UserProfile from '@/pages/UserProfile';
import Messenger from '@/pages/Messenger';
import MessengerNotSelected from '@/pages/Messenger/MessengerNotSelected';
import MessengerContent from '@/pages/Messenger/MessengerContent';
import MessengerNotFound from '@/pages/Messenger/MessengerNotFound';
import ErrorPage from '@/layouts/ErrorPage/ErrorPage';
import TopUpOTP from '@/pages/Auth/TopUpOTP';
import WithDrawOTP from '@/pages/Auth/WithDrawOTP';
import ForgotPassOTP from '@/pages/Auth/ForgotPassOTP';

const publicRoutes = [
    { path: '/*', component: ErrorPage },
    { path: '/', component: Home },
    // { path: '/login', component: SignIn, layout: null },
    // { path: '/register', component: SignUp, layout: null },
    // { path: '/forgot-password', component: ForgotPassword, layout: null },

    { path: '/top-up-otp', component: TopUpOTP, layout: null },
    { path: '/with-draw-otp', component: WithDrawOTP, layout: null },
    { path: '/forgot-pass-otp', component: ForgotPassOTP, layout: null },
    { path: '/user/profile/:urlCode', component: UserProfile },
    { path: '/player/profile/:urlCode', component: Profile },
    {
        path: '/messenger',
        component: Messenger,
        child: [
            { path: '', component: MessengerNotSelected, index: true },
            { path: ':id', component: MessengerContent },
            { path: '*', component: MessengerNotFound },
        ],
    },
    // messenger have outlet nested route
];

export { publicRoutes };
