import React, { Component } from 'react';
import './Footer.scss';

export default class Footer extends Component {
    state = { showBtn: false }

    toggleShowBtn = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 50) this.setState({ showBtn: true });
        else this.setState({ showBtn: false });
    }

    scrollToTop = () => window.scrollTo({ top: 0 });
    componentDidMount = () => window.addEventListener('scroll', this.toggleShowBtn);

    render() {
        return (
            <>
            <footer className='page-footer'>
                <div className='container'>
                    <p><small>Copyright - &copy; 2021 Shopper.</small></p>
                </div>
            </footer>
            {
                this.state.showBtn && (
                    <button className='top-btn' onClick={this.scrollToTop}>
                        <i className='fas fa-angle-up' />
                    </button>
                )
            }
            </>
        )
    }
}
