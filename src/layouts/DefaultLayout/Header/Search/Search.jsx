import { useEffect, useState, useRef } from 'react';
import TippyHeadless from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '@/components/Popper';
import { useDebounce } from '@/hooks';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { toast } from 'react-toastify';
import { resetProfile } from '@/_redux/features/player/playerSlice';

import playerApi from '@/api/searchApi';

// import { search } from '~/services/searchService';
import styles from './Search.module.scss';
import LoadingIcon from '@/layouts/LoadingIcon';
import Image from '@/components/Image';

const cx = classNames.bind(styles);

function Search() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector((state) => state?.user?.user?.information?.id);

    const searchRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setsearchResult] = useState([]);
    const [showResult, setShowResult] = useState(true);
    const [formSearchResponsive, setFormSearchResponsive] = useState(false);

    const handleClick = {
        openSearchResponsive: () => {
            setFormSearchResponsive((prev) => !prev);
        },
        findPlayer: (id) => {
            searchRef.current._tippy.hide();
            dispatch(resetProfile());
            setShowResult(false);
            if (id === user) {
                navigate(`/user/profile/${id}`);
                return;
            }
            navigate(`/player/profile/${id}`);
        },
    };

    const debounce = useDebounce(searchValue, 500);

    useEffect(() => {
        if (!debounce.trim()) {
            return;
        }

        const fetchApi = async () => {
            setLoading(true);
            const { data } = await playerApi.get(
                `v1/player?searchKey=${debounce}`
            );

            setsearchResult(data?.data?.user);
            if (data?.data?.user.length === 0) {
                toast.info('Can not find player, please try again!');
            }
            setLoading(false);
        };
        fetchApi();
    }, [debounce]);

    const handleHideResult = () => {
        setShowResult(false);
    };

    const handleChange = (e) => {
        const searchValueTo = e.target.value;
        if (!searchValueTo.startsWith(' ')) {
            setSearchValue(searchValueTo);
        }
    };

    return (
        <>
            <div className={cx('search__main')}>
                <TippyHeadless
                    ref={searchRef}
                    interactive
                    visible={showResult && searchResult.length > 0}
                    onClickOutside={handleHideResult}
                    render={(attrs) => (
                        <PopperWrapper>
                            <div
                                className={cx('search__result')}
                                tabIndex='-1'
                                {...attrs}
                            >
                                <h4 className={cx('search__result-title')}>
                                    Account
                                </h4>
                                {searchResult.map((result) => {
                                    return (
                                        <div
                                            key={result.id}
                                            className={cx('player__item')}
                                            onClick={() => {
                                                handleClick.findPlayer(
                                                    result.id
                                                );
                                            }}
                                        >
                                            <div
                                                className={cx(
                                                    'player__item-avatar'
                                                )}
                                            >
                                                {result?.avatar &&
                                                result?.avatar?.length > 0 ? (
                                                    <img
                                                        src={result?.avatar}
                                                        alt='avatar'
                                                    />
                                                ) : (
                                                    <Image
                                                        src=''
                                                        alt='avatar'
                                                    />
                                                )}
                                            </div>

                                            <div
                                                className={cx(
                                                    'player__item-name'
                                                )}
                                            >
                                                {result?.nickname}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </PopperWrapper>
                    )}
                >
                    <div className={cx('search')}>
                        {!!searchValue || (
                            <i
                                className={cx('fa-regular fa-magnifying-glass')}
                            ></i>
                        )}

                        <input
                            value={searchValue}
                            className={cx('search__input')}
                            placeholder='Search something...'
                            onChange={handleChange}
                            onFocus={() => setShowResult(true)}
                        />

                        {loading && (
                            <div className={cx('loading__icon')}>
                                <LoadingIcon />
                            </div>
                        )}
                    </div>
                    {/* 
                    <div className={cx('search__responsive')}>
                        <i className={cx('fa-regular fa-magnifying-glass')}></i>
                    </div> */}
                </TippyHeadless>
            </div>

            <div className={cx('search__responsive')}>
                <div
                    className={cx('icon__search')}
                    onClick={handleClick.openSearchResponsive}
                >
                    <i className={cx('fa-regular fa-magnifying-glass')}></i>
                </div>

                {formSearchResponsive && (
                    <div className={cx('search__responsive-container')}>
                        <TippyHeadless
                            interactive
                            visible={showResult && searchResult.length > 0}
                            onClickOutside={handleHideResult}
                            render={(attrs) => (
                                <PopperWrapper>
                                    <div
                                        className={cx('search__result')}
                                        tabIndex='-1'
                                        {...attrs}
                                    >
                                        <h4
                                            className={cx(
                                                'search__result-title'
                                            )}
                                        >
                                            Player
                                        </h4>
                                        {searchResult.map((result) => {
                                            return (
                                                <div
                                                    key={result.id}
                                                    className={cx(
                                                        'player__item'
                                                    )}
                                                    onClick={() => {
                                                        handleClick.findPlayer(
                                                            result.id
                                                        );
                                                    }}
                                                >
                                                    <div
                                                        className={cx(
                                                            'player__item-avatar'
                                                        )}
                                                    >
                                                        {result?.avatar &&
                                                        result?.avatar?.length >
                                                            0 ? (
                                                            <img
                                                                src={
                                                                    result?.avatar
                                                                }
                                                                alt='avatar'
                                                            />
                                                        ) : (
                                                            <Image
                                                                src=''
                                                                alt='avatar'
                                                            />
                                                        )}
                                                    </div>

                                                    <div
                                                        className={cx(
                                                            'player__item-name'
                                                        )}
                                                    >
                                                        {result?.nickname}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </PopperWrapper>
                            )}
                        >
                            <div className={cx('search')}>
                                {!!searchValue || (
                                    <i
                                        className={cx(
                                            'fa-regular fa-magnifying-glass'
                                        )}
                                    ></i>
                                )}
                                <input
                                    value={searchValue}
                                    className={cx('search__input')}
                                    placeholder='Search something...'
                                    onChange={handleChange}
                                    onFocus={() => setShowResult(true)}
                                />

                                {loading && (
                                    <div className={cx('loading__icon')}>
                                        <LoadingIcon />
                                    </div>
                                )}
                            </div>
                            {/* 
                            <div className={cx('search__responsive')}>
                                <i className={cx('fa-regular fa-magnifying-glass')}></i>
                            </div> */}
                        </TippyHeadless>
                    </div>
                )}
            </div>
        </>
    );
}

export default Search;
