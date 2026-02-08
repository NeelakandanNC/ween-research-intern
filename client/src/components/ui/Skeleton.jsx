const Skeleton = ({ className = '', variant = 'text' }) => {
    const variants = {
        text: 'h-4 rounded',
        title: 'h-6 rounded',
        avatar: 'h-12 w-12 rounded-full',
        button: 'h-10 w-24 rounded-xl',
        card: 'h-48 rounded-xl',
        thumbnail: 'h-20 w-20 rounded-lg'
    }

    return (
        <div
            className={`skeleton bg-gray-200 ${variants[variant]} ${className}`}
        />
    )
}

export const CardSkeleton = () => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <Skeleton variant="title" className="w-3/4 mb-2" />
                    <Skeleton className="w-1/2" />
                </div>
                <Skeleton variant="button" />
            </div>

            <div className="space-y-2 mb-4">
                <Skeleton className="w-full" />
                <Skeleton className="w-5/6" />
                <Skeleton className="w-4/6" />
            </div>

            <div className="flex gap-2 mb-4">
                <Skeleton className="w-16 h-6 rounded-full" />
                <Skeleton className="w-20 h-6 rounded-full" />
                <Skeleton className="w-14 h-6 rounded-full" />
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <Skeleton className="w-28" />
                <Skeleton variant="button" />
            </div>
        </div>
    )
}

export const TableRowSkeleton = () => {
    return (
        <tr className="border-b border-gray-100">
            <td className="py-4 px-4">
                <Skeleton className="w-32" />
            </td>
            <td className="py-4 px-4">
                <Skeleton className="w-24" />
            </td>
            <td className="py-4 px-4">
                <Skeleton className="w-20" />
            </td>
            <td className="py-4 px-4">
                <Skeleton variant="button" className="w-20" />
            </td>
        </tr>
    )
}

export const ProfileSkeleton = () => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Skeleton variant="avatar" />
                <div className="flex-1">
                    <Skeleton variant="title" className="w-48 mb-2" />
                    <Skeleton className="w-32" />
                </div>
            </div>
            <div className="space-y-2">
                <Skeleton className="w-full" />
                <Skeleton className="w-3/4" />
            </div>
        </div>
    )
}

export default Skeleton
