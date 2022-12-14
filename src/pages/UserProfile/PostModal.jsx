import { useState } from 'react';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import imgbbApi from '@/api/imgbbApi';
import { CFormCheck } from '@coreui/react';

import userApi from '@/api/userApi';

import { handlePostModal } from '@/_redux/features/modal/modalSlice';
import { updatePost } from '@/_redux/features/user/userSlice';

import Modal from '@/components/Modal';
import Image from '@/components/Image';
import LoadingIcon from '@/layouts/LoadingIcon';

import styles from './Profile.module.scss';

const cx = classNames.bind(styles);

const MAX_COUNT = 4;

function PostModal() {
    const dispatch = useDispatch();
    const modal = useSelector((state) => state?.modal?.modalType.postModal);
    const user = useSelector((state) => state?.user?.user?.information);

    const [mediaOption, setMediaOption] = useState('Video');

    const [loading, setLoading] = useState(false);

    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [fileLimit, setFileLimit] = useState(false);

    const [previewPhotos, setPreviewPhotos] = useState([]);

    const [videoLink, setVideoLink] = useState(
        user?.post && user?.post?.type === 'Video' ? user?.post?.media : ''
    );
    const [caption, setCaption] = useState(user?.post?.content || '');

    //     Upload multiple files
    const handleSetPreviewPhotos = (files) => {
        const previewPhotos = [];
        for (let i = 0; i < files.length; i++) {
            previewPhotos.push(URL.createObjectURL(files[i]));
        }
        setPreviewPhotos(previewPhotos);
    };

    const handleUploadFiles = (files) => {
        const uploaded = [...uploadedFiles];
        let limitExceeded = false;
        files.some((file) => {
            if (uploaded.findIndex((f) => f.name === file.name) === -1) {
                uploaded.push(file);
                if (uploaded.length === MAX_COUNT) setFileLimit(true);
                if (uploaded.length > MAX_COUNT) {
                    toast.error(
                        `You can only add a maximum of ${MAX_COUNT} files`
                    );
                    setFileLimit(false);
                    limitExceeded = true;
                    return true;
                }
            }
            return false;
        });
        if (!limitExceeded) {
            setUploadedFiles(uploaded);
            handleSetPreviewPhotos(uploaded);
        }
    };

    const handleFileEvent = (e) => {
        const chosenFiles = Array.prototype.slice.call(e.target.files);
        handleUploadFiles(chosenFiles);
    };

    const handleUpdoadPhoto = async () => {
        const formPhotos = uploadedFiles.map((file) => {
            const form = new FormData();
            form.append('image', file);
            return form;
        });
        const photos = formPhotos.map((form) => {
            return imgbbApi.post('upload', form);
        });
        const res = await Promise.all(photos);
        let urlPhotos = res.map((r) => r?.data?.data?.display_url);
        return urlPhotos;
    };

    const handleRemovePhoto = (index) => {
        const uploaded = [...uploadedFiles];
        uploaded.splice(index, 1);
        setUploadedFiles(uploaded);
        handleSetPreviewPhotos(uploaded);
    };

    const regexYoutubeUrl =
        /^(https?:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;

    // use handleUpdoadPhoto to upload photos to imgbb

    const handlePost = async () => {
        if (
            mediaOption === 'Video' &&
            (videoLink === '' || videoLink === undefined || videoLink === null)
        ) {
            toast.error('Please add media');
            return;
        }

        if (mediaOption === 'Video' && !regexYoutubeUrl.test(videoLink)) {
            toast.error('Youtube link is invalid');
            return;
        }

        try {
            setLoading(true);
            let upLoadToImgbb;

            if (mediaOption === 'Image') {
                upLoadToImgbb = await handleUpdoadPhoto();
            }

            const { data } = await userApi.put('v1/user/bio', {
                content: caption,
                media: mediaOption === 'Video' ? videoLink : upLoadToImgbb,
                type: mediaOption,
            });
            dispatch(updatePost(data?.data?.post));
            dispatch(handlePostModal(false));
            setLoading(false);
            toast.success('Update post successfully');
        } catch (error) {
            toast.error(error?.response?.data?.error || 'Something went wrong');
            setLoading(false);
        }
    };

    return (
        <Modal
            title='Add to information'
            show={modal}
            close={() => dispatch(handlePostModal(false))}
            size='medium'
        >
            <div className={cx('post__modal')}>
                <div className={cx('heading')}>
                    <div className={cx('heading__avatar')}>
                        {user?.avatar && user?.avatar.length > 0 ? (
                            <img src={user?.avatar} alt='avatar' />
                        ) : (
                            <Image src='' alt='avatar' />
                        )}
                    </div>
                    <div className={cx('info')}>
                        <span className={cx('info__name')}>
                            {user?.nickname}
                        </span>
                        <span className={cx('info__faculty')}>
                            {user?.role}
                        </span>
                    </div>
                </div>

                <div className={cx('content')}>
                    <textarea
                        value={caption}
                        placeholder='Write something'
                        className={cx('content__text')}
                        onChange={(e) => setCaption(e.target.value)}
                    ></textarea>
                </div>

                <div className={cx('feature')}>
                    <div className={cx('feature__option')}>
                        <span>Media option</span>
                        <CFormCheck
                            value={'Video'}
                            type='radio'
                            name='media'
                            id='Video'
                            onChange={(e) => {
                                setMediaOption(e.target.value);
                            }}
                            label='Video link (Youtube)'
                            defaultChecked
                        />
                        <CFormCheck
                            value={'Image'}
                            type='radio'
                            name='media'
                            id='Image'
                            label='Image'
                            onChange={(e) => {
                                setMediaOption(e.target.value);
                                setVideoLink('');
                            }}
                        />
                    </div>

                    {previewPhotos && previewPhotos.length > 0 ? (
                        <div className={cx('previewer')}>
                            {previewPhotos.map((photo, index) => (
                                <div
                                    className={cx('previewer__item')}
                                    key={index}
                                    style={{ backgroundImage: `url(${photo})` }}
                                >
                                    <div
                                        className={cx('remove')}
                                        onClick={() => handleRemovePhoto(index)}
                                    >
                                        <i
                                            className={cx(
                                                'fa-regular fa-xmark'
                                            )}
                                        ></i>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : null}

                    <div className={cx('feature__media')}>
                        {mediaOption === 'Video' ? (
                            <div className={cx('input__video-link')}>
                                <i className={cx('fa-regular fa-paste')}></i>
                                <input
                                    value={videoLink}
                                    type='text'
                                    placeholder='Past your youtube link in here'
                                    onChange={(e) =>
                                        setVideoLink(e.target.value.trim())
                                    }
                                />
                            </div>
                        ) : (
                            <div className={cx('input__photo')}>
                                <label htmlFor='uploadPhotos'>
                                    <i
                                        className={cx(
                                            'fa-light fa-down-to-bracket'
                                        )}
                                    ></i>
                                    <p>Click to select file(s)</p>
                                </label>
                                <input
                                    type='file'
                                    accept='image/*'
                                    id='uploadPhotos'
                                    onChange={handleFileEvent}
                                    disabled={fileLimit}
                                    hidden
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className={cx('footer')}>
                    {loading ? (
                        <LoadingIcon />
                    ) : (
                        <button onClick={handlePost}>
                            {user?.post && Object.keys(user.post).length > 0
                                ? 'Update'
                                : 'Create'}
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
}

export default PostModal;
