import classNames from 'classnames/bind';
import { useSelector, useDispatch } from 'react-redux';
import {
    setClickedImg,
    setCurrentIndex,
} from '@/_redux/features/previewer/previewerSlice';

import styles from './ImagePreviewer.module.scss';

const cx = classNames.bind(styles);

function ImageViewer({ sourceImage }) {
    const dispatch = useDispatch();

    const preview = useSelector((state) => state.previewer.previewer);

    const handleClick = () => {
        dispatch(setClickedImg(null));
    };

    const handelRotationRight = () => {
        const totalLength = sourceImage.length;
        if (preview.currentIndex + 1 >= totalLength) {
            dispatch(setCurrentIndex(0));
            const newUrl = sourceImage[0];
            dispatch(setClickedImg(newUrl));
        }

        const newIndex = preview.currentIndex + 1;
        const newUrl = sourceImage.filter((item) => {
            return sourceImage.indexOf(item) === newIndex;
        });
        const newItem = newUrl[0];
        dispatch(setClickedImg(newItem));
        dispatch(setCurrentIndex(newIndex));
    };

    const handelRotationLeft = () => {
        const totalLength = sourceImage.length;
        if (preview.currentIndex === 0) {
            dispatch(setCurrentIndex(totalLength - 1));
            const newUrl = sourceImage[totalLength - 1];
            dispatch(setClickedImg(newUrl));
        }
        const newIndex = preview.currentIndex - 1;
        const newUrl = sourceImage.filter((item) => {
            return sourceImage.indexOf(item) === newIndex;
        });
        const newItem = newUrl[0];
        dispatch(setClickedImg(newItem));
        dispatch(setCurrentIndex(newIndex));
    };

    return (
        <div className={cx('wrapper')}>
            <div
                className={cx('action__btn', 'btn__prev')}
                onClick={handelRotationLeft}
            >
                <i className={cx('fa-light fa-chevron-left')}></i>
            </div>
            <div
                className={cx('action__btn', 'btn__next')}
                onClick={handelRotationRight}
            >
                <span>
                    <i className={cx('fa-light fa-chevron-right')}></i>
                </span>
            </div>
            <div className={cx('btn__close', 'dismiss')} onClick={handleClick}>
                <i className={cx('fa-regular fa-xmark')}></i>
            </div>
            <div className={cx('container')}>
                <img src={preview.clickedImg} alt='' />
            </div>
        </div>
    );
}

export default ImageViewer;
