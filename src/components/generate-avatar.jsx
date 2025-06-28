import { createAvatar } from '@dicebear/core';
import{ botttsNeutral, initials } from '@dicebear/collection';
import { Avatar } from './ui/avatar';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';

export const GeneratedAvatar = ({ seed, className, varient = 'initials' }) => {
    let avatar;
    if(varient === "botttsNeutral") {
        avatar = createAvatar(botttsNeutral, {
            seed
        })
    }
    else {
        avatar = createAvatar(initials, {
            seed,
            fontWeight: 600,
            fontSize: 42,
        });
    }
    return (
        <div>
            <Avatar className={cn(className)}>
                <AvatarImage  src={avatar.toDataUri()} alt="Avatar"/>
            </Avatar>
        </div>
    )
}