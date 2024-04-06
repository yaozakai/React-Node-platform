import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import * as brandsIcons from '@fortawesome/free-brands-svg-icons';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import './effects.scss';

interface IconProps {
    [key: string]: {
        icon: IconProp;
        href: string;
    };
}

export default function Socials() {
    const iconProps: IconProps = {
        // 'faTwitter': { icon: brandsIcons.faTwitter, href: 'twitter-link' },
        // 'faFacebook': { icon: brandsIcons.faFacebook, href: 'facebook-link' },
        // 'faWhatsapp': { icon: brandsIcons.faWhatsapp, href: 'whatsapp-link' },
        // 'faUser': { icon: solidIcons.faUser, href: 'user-link' }
        'faHouse': { icon: solidIcons.faEnvelope, href: 'mailto:walt.yao@gmail.com' },
        'faLine': { icon: brandsIcons.faLine, href: 'https://line.me/ti/p/2xe4zhsoin' },
        'faLinkedin': { icon: brandsIcons.faLinkedin, href: 'https://www.linkedin.com/in/waltyao' },
        'faGithub': { icon: brandsIcons.faGithub, href: 'https://github.com/yaozakai' },
    };

    return (
        <>
            {Object.keys(iconProps).map((icon, index) => (
                <a key={index} href={iconProps[icon].href}>
                    <FontAwesomeIcon className='mr-3' icon={iconProps[icon].icon} />
                </a>
            ))}
        </>
    );
}
