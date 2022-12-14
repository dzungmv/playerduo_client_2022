import Header from './Header';

function DefaultLayout({ children }) {
    return (
        <>
            <Header />
            <div className='content'>{children}</div>
        </>
    );
}

export default DefaultLayout;
