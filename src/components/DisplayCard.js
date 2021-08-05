import React, { Component } from 'react'
const maxDescriptionLength = 125

export default class DisplayCard extends Component {

    render() {
        let description = this.props.description + '';
        const displayDescription = description.slice(0, maxDescriptionLength) + (description.length > maxDescriptionLength ? "..." : "")

              // <div class="content">
              //     <div class="header">{this.props.header}</div>
              //     <div class="meta">
              //         <span>{this.props.date}</span>
              //     </div>
              //     <div class="description">
              //         <p>{this.props.description.substring(0, 200) + (this.props.description.length > 200 ? '...' : '') }</p>
              //     </div>
              // </div>
              // <div class="extra content">
              //     <span style={{ float: 'left' }}>
        return (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a className="ui attatched card" name='card' style={{ height: '100%', width: '100%' }}>
                <div className="content">
                    <div className="header">{this.props.header}</div>
                    <div className="meta">
                        <span>{this.props.date}</span>
                    </div>
                    <div className="description">
                        <p>{displayDescription}</p>
                    </div>
                </div>
                <div className="extra content">
                    <span style={{ float: 'left' }}>
                        <img className="ui avatar image" alt='avatar' src={this.props.pic} /> {this.props.name}
                    </span>
                    <span style={{ float: 'right', margin: '3px' }}>
                        <i className={this.props.icon}></i>
                    </span>
                </div>
            </a>
        )
    }
}
