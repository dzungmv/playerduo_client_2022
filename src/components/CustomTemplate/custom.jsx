// form action
const cx = 1;
function Custom() {
    return (
        <>
            <div className={cx('form__action')}>
                <button className={cx('form__btn-close')}>Close</button>

                <div className={cx('form__btn-primary')}>
                    <button>Rent</button>
                </div>
            </div>
        </>

        // Css
    );
}

export default Custom;
