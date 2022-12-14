import PropTypes from 'prop-types';
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/animations/scale.css';
import classNames from 'classnames/bind';
import { Wrapper as PopperWrapper } from '~/components/Popper';

import styles from './Menu.module.scss';
import MenuItem from './MenuItem';

const cx = classNames.bind(styles);

function Menu({ children, items = [], hideOnClick = false }) {
	const renderItems = () => {
		return items.map((item, index) => <MenuItem key={index} data={item} />);
	};

	const renderRes = (attrs) => (
		<div className={cx('menu-list')} tabIndex='-1' {...attrs}>
			<PopperWrapper className={cx('menu-popper')}>
				{renderItems(items)}
			</PopperWrapper>
		</div>
	);

	return (
		<Tippy
			interactive
			delay={[0, 700]}
			placement='bottom-end'
			hideOnClick={hideOnClick}
			render={renderRes}
		>
			{children}
		</Tippy>
	);
}

Menu.propTypes = {
	children: PropTypes.node.isRequired,
	items: PropTypes.array,
	hideOnClick: PropTypes.bool,
};

export default Menu;
