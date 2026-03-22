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
        weddingDate: '2026-04-04T17:00:00+07:00',
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
            mother: 'Lê Thị Thúy',
            city: 'Tỉnh Hưng Yên',
        },
        bride: {
            father: 'Vũ Văn Thuân',
            mother: 'Phan Thị Yến',
            city: 'Tỉnh Hưng Yên',
        },
    },
    event: {
        time: '2026-04-04T17:00:00+07:00',
        dayOfWeek: 'Thứ Bảy',
        lunarDate: 'Tức ngày 18 tháng 02 năm 2026',
        groom: {
            venue: 'Tư Gia Nhà Trai',
            address: 'Xóm 2, Thôn Thọ Bình, Xã Triệu Việt Vương, Hưng Yên',
            mapsUrl: 'https://maps.app.goo.gl/xdQzEb5yMTWr97pJA',
        },
        bride: {
            venue: 'Tư Gia Nhà Gái',
            address: 'Xóm Đông, Xã Việt Yên, Hưng Yên',
            mapsUrl: 'https://maps.app.goo.gl/ZSyZozeupShC5vJ48',
        },
    },
    timeline: [
        { time: '17:00', label: 'Đón Khách', icon: 'camera' as const },
        { time: '17:30', label: 'Khai Tiệc', icon: 'champagne' as const },
        { time: '19:00', label: 'Văn Nghệ', icon: 'music' as const },
    ],
    gift: {
        bankName: 'Vietcombank',
        accountNumber: '0123456789',
        accountHolder: 'LÊ MINH HOÀNG',
    },
}

// Photo-to-role mapping — adjust which photo goes where
export const weddingImages = {
    heroCouple: imageManifest['2S8A6575'],
    heroCouple2: imageManifest['hero-couple'],
    groom: imageManifest['2S8A6676'],
    bride: imageManifest['Z72_6163'],
    scenic: imageManifest['2S8A6626'],
    quotePhoto: imageManifest['2S8A6494'],
    thankYou: imageManifest['2S8A6682'],
    gallery: [
        imageManifest['hero-couple'],
        imageManifest['2S8A6428'],
        imageManifest['2S8A6445'],
        imageManifest['2S8A6687'],
        imageManifest['2S8A6578'],
        imageManifest['2S8A6544'],
        imageManifest['2S8A6494'],
        imageManifest['2S8A6514'],
        imageManifest['2S8A6480'],
        imageManifest['2S8A6566'],
        imageManifest['2S8A6575'],
        imageManifest['2S8A6598'],
        imageManifest['2S8A6663'],
        imageManifest['2S8A6676'],
        imageManifest['2S8A6682'],
        imageManifest['Z72_5967'],
        imageManifest['Z72_6163'],
        imageManifest['Z72_6221'],
        imageManifest['Z72_6229'],
    ],
}
