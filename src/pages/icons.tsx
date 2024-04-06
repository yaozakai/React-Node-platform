import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import * as brandsIcons from '@fortawesome/free-brands-svg-icons';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';


interface IconProps {
    [key: string]: {
        icon: IconProp;
    };
}

interface SocialsProps {
    iconKey: string;
    href: string;
}

export default function Socials({ iconKey, href }: SocialsProps) {
    const iconProps: IconProps = {
        'faAt': { icon: solidIcons.faAt },
        'faEnvelope': { icon: solidIcons.faEnvelope },
        'faKey': { icon: solidIcons.faKey },
        'faArrowRight': { icon: solidIcons.faArrowRight },
        'faCircleExclamation': { icon: solidIcons.faCircleExclamation },
        'faHouse': { icon: solidIcons.faEnvelope },
        'faLine': { icon: brandsIcons.faLine },
        'faLinkedin': { icon: brandsIcons.faLinkedin },
        'faGithub': { icon: brandsIcons.faGithub },
        'faTwitter': { icon: brandsIcons.faTwitter },
        'faFacebook': { icon: brandsIcons.faFacebook },
    };

    const { icon } = iconProps[iconKey];

    return (
        <a href={href}>
            <FontAwesomeIcon className='mr-3' icon={icon} />
        </a>
    );
}
