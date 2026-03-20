import { imageManifest } from './image-manifest'

export const weddingConfig = {
    couple: {
        groom: {
            name: 'Minh Hoàng',
            displayName: 'MINH HOÀNG',
            fullName: 'Lê Minh Hoàng',
        },
        bride: {
            name: 'Thanh Thư',
            displayName: 'THANH THƯ',
            fullName: 'Vũ Thanh Thư',
        },
        weddingDate: '2026-04-05T09:00:00+07:00',
    },
    quote: {
        hero: 'All of me loves All of you',
        split: 'Bên cạnh em, mỗi khoảnh khắc bình thường đều trở thành kỷ niệm vĩnh cửu.',
    },
    story: [
        'Mọi thứ bắt đầu từ một lời chào giản đơn, nhưng đã thay đổi cả cuộc đời chúng tôi.',
        'Qua những khoảnh khắc cười đùa, những buổi tối ấm áp bên nhau, chúng tôi đã cùng nhau lớn lên, học hỏi và yêu thương.',
        'Hôm nay, chúng tôi hân hoan chia sẻ hành trình này với những người thân yêu, và mong chờ được cùng các bạn ăn mừng tình yêu của chúng tôi.',
    ],
    families: {
        groom: {
            father: 'Lê Đình Thuật',
            mother: 'Lê Thị Thuỷ',
            city: 'TP. Hưng Yên',
        },
        bride: {
            father: 'Vũ Văn Thuân',
            mother: 'Phan Thị Yến',
            city: 'TP. Hưng Yên',
        },
    },
    event: {
        time: '2026-04-05T09:00:00+07:00',
        dayOfWeek: 'Chủ Nhật',
        lunarDate: 'Tức ngày 18 tháng 02 năm 2026',
        venue: 'Tư Gia Nhà Trai',
        address: 'xóm 2, thôn Thọ Bình, xã Triệt Việt Vương, tỉnh Hưng Yên',
        mapsUrl: 'https://www.google.com/maps?q=20.8715,106.0168',
    },
    timeline: [
        { time: '09:30', label: 'Đón Khách', icon: 'camera' as const },
        { time: '11:00', label: 'Khai Tiệc', icon: 'champagne' as const },
        { time: '12:00', label: 'Lễ Thành Hôn', icon: 'rings' as const },
    ],
    gift: {
        bankName: 'Vietcombank',
        accountNumber: '0123456789',
        accountHolder: 'LÊ MINH HOÀNG',
    },
}

// Photo-to-role mapping — adjust which photo goes where
export const weddingImages = {
    heroCouple: imageManifest['hero-couple'],
    groom: imageManifest['2S8A6480'],
    bride: imageManifest['2S8A6575'],
    scenic: imageManifest['2S8A6676'],
    quotePhoto: imageManifest['2S8A6578'],
    thankYou: imageManifest['2S8A6682'],
    gallery: [
        imageManifest['hero-couple'],
        imageManifest['2S8A6480'],
        imageManifest['2S8A6575'],
        imageManifest['2S8A6578'],
        imageManifest['Z72_6163'],
        imageManifest['Z72_6221'],
    ],
}
