import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';

import styles from './ErrorPage.module.scss';

const cx = classNames.bind(styles);

function ErrorPage() {
    const navigate = useNavigate();

    const handleGotoNewsFeed = () => {
        navigate('/');
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('wrapper__container')}>
                <div className={cx('break__link')}>
                    <i className={cx('fa-solid fa-link-slash')}></i>
                </div>

                <div className={cx('des__1')}>This page isn't available</div>
                <p>
                    The link may be broken, or the page may have been removed.
                </p>
                <p>
                    Check to see if the link you're trying to open is correct.
                </p>

                <div className={cx('back__btn')}>
                    <button onClick={handleGotoNewsFeed}>
                        Go to News Feed
                    </button>
                </div>

                <div onClick={handleBack} className={cx('back__link')}>
                    Go back
                </div>
            </div>
        </div>
    );
}

export default ErrorPage;
