// 宝贝成长记 - JavaScript 功能实现

// DOM 元素
let modal, modalTitle, modalContent, closeModal, cancelModal, saveModal;
let addNewBtn, addPhotoBtn, addMilestoneBtn, addDiaryBtn, editProfileBtn;
let imageViewer, viewerImage, viewerCaption, closeImageViewer, photoGallery;

// 初始化DOM元素
function initDOMElements() {
    modal = document.getElementById('modal');
    modalTitle = document.getElementById('modal-title');
    modalContent = document.getElementById('modal-content');

    // 从本地存储加载按钮文字
    if (document.getElementById('addPhotoBtn') && localStorage.getItem('buttonText_addPhotoBtn')) {
        document.getElementById('addPhotoBtn').innerHTML = '<i class="fa fa-camera mr-2"></i>' + localStorage.getItem('buttonText_addPhotoBtn');
    }
    if (document.getElementById('addMilestoneBtn') && localStorage.getItem('buttonText_addMilestoneBtn')) {
        document.getElementById('addMilestoneBtn').innerHTML = '<i class="fa fa-star mr-2"></i>' + localStorage.getItem('buttonText_addMilestoneBtn');
    }
    if (document.getElementById('addDiaryBtn') && localStorage.getItem('buttonText_addDiaryBtn')) {
        document.getElementById('addDiaryBtn').innerHTML = '<i class="fa fa-book mr-2"></i>' + localStorage.getItem('buttonText_addDiaryBtn');
    }
    if (document.getElementById('editProfileBtn') && localStorage.getItem('buttonText_editProfileBtn')) {
        document.getElementById('editProfileBtn').innerHTML = '<i class="fa fa-edit mr-2"></i>' + localStorage.getItem('buttonText_editProfileBtn');
    }
    closeModal = document.getElementById('close-modal');
    cancelModal = document.getElementById('cancel-modal');
    saveModal = document.getElementById('save-modal');
    addNewBtn = document.getElementById('add-new-btn');
    addPhotoBtn = document.getElementById('add-photo-btn');
    addMilestoneBtn = document.getElementById('add-milestone-btn');
    addDiaryBtn = document.getElementById('add-diary-btn');
    editProfileBtn = document.getElementById('edit-profile-btn');
    // 获取模态框相关元素
    imageViewer = document.getElementById('image-viewer');
    viewerImage = document.getElementById('viewer-image');
    viewerCaption = document.getElementById('viewer-caption');
    closeImageViewer = document.getElementById('close-image-viewer');
    photoGallery = document.getElementById('photo-gallery');

    // 获取各页面按钮元素
    addPhotoBtn = document.getElementById('add-photo-btn');
    addMilestoneBtn = document.getElementById('add-milestone-btn');
    addDiaryBtn = document.getElementById('add-diary-btn');
    editProfileBtn = document.getElementById('edit-profile-btn');
    addNewBtn = document.getElementById('add-new-btn');
    closeModal = document.getElementById('close-modal');
    cancelModal = document.getElementById('cancel-modal');
    saveModal = document.getElementById('save-modal');
}

// 全局变量
let currentModalType = null;
let sortBy = 'all'; // 照片排序方式
let milestoneFilter = 'all'; // 成长瞬间筛选类别
let diarySearchQuery = ''; // 日记搜索关键词
let currentPhotos = [];
let currentMilestones = [];
let currentDiaries = [];
let currentBabyInfo = {
    name: '小宝贝',
    birthday: '2023-01-01',
    gender: '男/女',
    avatar: 'https://picsum.photos/id/237/300/300'
};
let selectedImages = [];

// 初始化函数
function init() {
    // 延迟初始化以确保DOM加载完成
    // 移除初始化延迟以避免页面闪烁

    // 加载本地存储的数据
    loadData();

    // 初始化DOM元素
    initDOMElements();

    // 更新UI显示
    // 根据当前页面调用相应的渲染函数
    const path = window.location.pathname;
    if (path.includes('gallery.html')) {
        renderPhotos();
    } else if (path.includes('milestones.html')) {
        if (path.includes('milestones.html')) if (document.querySelector('#milestones-container')) renderMilestones();
    } else if (path.includes('diary.html')) {
        if (path.includes('diary.html')) if (document.querySelector('#diaries-container')) renderDiaries();
    } else if (path.includes('profile.html')) {
        updateBabyInfo();
        if (path.includes('profile.html')) renderProfile();
    }

    // 事件监听
    setupEventListeners();
    setupNavigation();
    // 页面初始化完成后淡入显示
    document.body.style.opacity = "1";
    // 移除初始化延迟以避免页面闪烁

}

document.addEventListener('DOMContentLoaded', init);

// 设置导航激活状态
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section[id]');

    // 设置初始激活状态
    setActiveNavItem('profile');

    // 导航项点击事件
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const targetId = item.getAttribute('href').substring(1);
            setActiveNavItem(targetId);
        });
    });

    // 滚动时更新导航状态
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        setActiveNavItem(current);
    });
}

// 设置激活的导航项
function setActiveNavItem(targetId) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const href = item.getAttribute('href').substring(1);
        if (href === targetId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// 设置事件监听
function setupEventListeners() {
    // 编辑按钮事件委托
    document.addEventListener('click', (e) => {
        if (e.target.closest('.edit-btn')) {
            const item = e.target.closest('.milestone-item, .photo-item, .diary-item');
            if (item) editItem(item);
        }
    });

    // 移除所有移动端菜单相关代码（已改用底部导航）
    // 导航栏滚动效果代码已完全移除

    // 移除导航栏滚动效果代码（已改用底部导航）

    // 模态框相关事件
    if (addNewBtn) addNewBtn.addEventListener('click', openModal);
    if (addPhotoBtn) {
        addPhotoBtn.addEventListener('click', () => openModal('photo'));
        addPhotoBtn.addEventListener('dblclick', (e) => editButtonText(e, 'addPhotoBtn'));
    }
    if (addMilestoneBtn) {
        addMilestoneBtn.addEventListener('click', () => openModal('milestone'));
        addMilestoneBtn.addEventListener('dblclick', (e) => editButtonText(e, 'addMilestoneBtn'));
    }
    if (addDiaryBtn) {
        addDiaryBtn.addEventListener('click', () => openModal('diary'));
        addDiaryBtn.addEventListener('dblclick', (e) => editButtonText(e, 'addDiaryBtn'));
    }
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => openModal('profile'));
        editProfileBtn.addEventListener('dblclick', (e) => editButtonText(e, 'editProfileBtn'));
    }
    if (closeModal) closeModal.addEventListener('click', closeModalWindow);
    if (cancelModal) cancelModal.addEventListener('click', closeModalWindow);
    if (saveModal) saveModal.addEventListener('click', saveModalData);

    // 已移除重复的photoFilter声明


    // 已合并到下方的类型选择事件处理


    // 日记搜索事件
    const diarySearchInput = document.getElementById('diary-search');
    if (diarySearchInput) {
        diarySearchInput.addEventListener('input', (e) => {
            diarySearchQuery = e.target.value.toLowerCase();
            if (path.includes('diary.html')) renderDiaries();
        });
    }

    // 类型选择事件
    const milestoneFilterSelect = document.getElementById('milestone-filter');
    if (milestoneFilterSelect) {
        milestoneFilterSelect.addEventListener('change', (e) => {
            milestoneFilter = e.target.value;
            if (path.includes('milestones.html')) renderMilestones();
        });
    }

    // 已合并到上方的照片筛选事件处理


    // 类型选择事件
    document.querySelectorAll('.type-option').forEach(option => {
        if (option) {
            option.addEventListener('click', () => {
                const type = option.dataset.type;
                openModal(type);
            });
        }
    });

    // 照片点击事件 - 切换到照片详情页
    function showSection(sectionId) {
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(sectionId)?.classList.remove('hidden');
        // 更新导航激活状态
        setActiveNavItem(sectionId);
    }

    function loadPhotoDetail(photo) {
        const detailContainer = document.getElementById('photo-detail-container');
        if (!detailContainer) return;

        detailContainer.innerHTML = `
        <div class="photo-detail">
            <img src="${photo.imageUrl}" alt="${photo.title}" class="detail-image">
            <div class="detail-info">
                <h2>${photo.title}</h2>
                <p class="date">${photo.date}</p>
                <div class="actions">
                    <button class="edit-btn" data-id="${photo.id}">编辑</button>
                    <button class="delete-btn" data-id="${photo.id}">删除</button>
                </div>
            </div>
        </div>
    `;
    }

    // 照片点击事件 - 切换到照片详情页
    document.addEventListener('click', (e) => {
        if (e.target.closest('.photo-item img')) {
            const photoId = e.target.closest('.photo-item').dataset.id;
            const photo = currentPhotos.find(p => p.id === photoId);
            if (photo) {
                // 切换到照片详情页
                showSection('photo-detail');
                // 加载照片详情
                loadPhotoDetail(photo);
            }
        }
    });
    if (closeImageViewer) closeImageViewer.addEventListener('click', closeImageViewerWindow);

    // 点击模态框外部关闭
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModalWindow();
        });
    }

    if (imageViewer) {
        imageViewer.addEventListener('click', (e) => {
            if (e.target === imageViewer) closeImageViewerWindow();
        });
    }

    // 加载更多照片
    const loadMoreBtn = document.getElementById('load-more-photos');
    if (loadMoreBtn) loadMoreBtn.addEventListener('click', loadMorePhotos);

    // 删除按钮事件委托
    document.addEventListener('click', (e) => {
        if (e.target.closest('[title="删除"], .fa-trash, .delete-btn')) {
            const item = e.target.closest('.photo-item, .milestone-item, .diary-item');
            if (item && confirm('确定要删除这个项目吗？')) {
                deleteItem(item);
            }
        }
    });

    // 编辑按钮事件委托
    document.addEventListener('click', (e) => {
        if (e.target.closest('.fa-pencil')) {
            const item = e.target.closest('.photo-item, .milestone-item, .diary-item');
            if (item) {
                editItem(item);
            }
        }
    });
}

// 按钮文字编辑功能
function editButtonText(e, buttonId) {
    e.stopPropagation();
    const button = document.getElementById(buttonId);
    if (!button) return;

    // 获取当前按钮文本
    const currentText = button.textContent.trim();

    // 创建输入框
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'bg-white border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary';
    input.style.width = 'auto';
    input.style.minWidth = button.offsetWidth + 'px';

    // 清空按钮内容并添加输入框
    button.innerHTML = '';
    button.appendChild(input);
    input.focus();

    // 处理输入完成
    function handleComplete() {
        const newText = input.value.trim();
        if (newText) {
            // 恢复按钮原始结构
            if (buttonId === 'addPhotoBtn') {
                button.innerHTML = '<i class="fa fa-camera mr-2"></i>' + newText;
            } else if (buttonId === 'addMilestoneBtn') {
                button.innerHTML = '<i class="fa fa-star mr-2"></i>' + newText;
            } else if (buttonId === 'addDiaryBtn') {
                button.innerHTML = '<i class="fa fa-book mr-2"></i>' + newText;
            } else if (buttonId === 'editProfileBtn') {
                button.innerHTML = '<i class="fa fa-edit mr-2"></i>' + newText;
            }

            // 保存到本地存储
            localStorage.setItem('buttonText_' + buttonId, newText);
        }
    }

    // 监听回车和失去焦点事件
    input.addEventListener('blur', handleComplete);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            input.blur();
        } else if (e.key === 'Escape') {
            button.innerHTML = button.originalHTML;
        }
    });
}

// 移除移动端菜单切换函数（已改用底部导航）

// 移除导航栏滚动效果函数（已改用底部导航）

// 打开模态框
function openModal(type = null) {
    modal.classList.remove('hidden');
    saveModal.classList.remove('hidden');

    if (type) {
        currentModalType = type;
        modalTitle.textContent = getModalTitle(type);
        renderModalContent(type);
    } else {
        currentModalType = null;
        modalTitle.textContent = '添加新记录';
        document.getElementById('select-type-content').classList.remove('hidden');
    }

    // 禁止背景滚动
    document.body.style.overflow = 'hidden';
}

// 关闭模态框
function closeModalWindow() {
    const modal = document.getElementById('modal');

    if (modal) {
        modal.classList.add('hidden');
    }

    document.body.style.overflow = 'auto';
    selectedImages = [];

    // 尝试获取select-type-content元素但不输出警告
    const selectTypeContent = document.getElementById('select-type-content');
    if (selectTypeContent) {
        selectTypeContent.classList.remove('hidden');
    }
}

// 获取模态框标题
function getModalTitle(type) {
    const titles = {
        photo: '添加照片',
        milestone: '添加成长瞬间',
        diary: '写日记',
        profile: '编辑宝贝信息'
    };
    return titles[type] || '添加新记录';
}

// 渲染模态框内容
function renderModalContent(type) {
    let formHtml = '';

    switch (type) {
        case 'photo':
            formHtml = `
                <div class="space-y-4">
                    <div class="form-group">
                        <label for="photo-title">照片标题</label>
                        <input type="text" id="photo-title" placeholder="例如：第一次洗澡">
                    </div>
                    <div class="form-group">
                        <label for="photo-date">拍摄日期</label>
                        <input type="date" id="photo-date" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="form-group">
                        <label>上传照片</label>
                        <div class="image-upload">
                            <input type="file" id="photo-upload" accept="image/*" multiple>
                            <i class="fa fa-cloud-upload text-4xl text-gray-400 mb-2"></i>
                            <p class="text-gray-500">点击或拖拽照片到此处上传</p>
                        </div>
                        <div id="photo-preview" class="preview-container"></div>
                    </div>
                </div>
            `;
            break;

        case 'milestone':
            formHtml = `
                <div class="space-y-4">
                    <div class="form-group">
                        <label for="milestone-title">定格标题</label>
                        <input type="text" id="milestone-title" placeholder="例如：第一次翻身">
                    </div>
                    <div class="form-group">
                        <label for="milestone-date">定格日期</label>
                        <input type="date" id="milestone-date" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="form-group">
                        <label for="milestone-description">写下你的小日记</label>
                        <textarea id="milestone-description" placeholder="记录这个特别时刻..."></textarea>
                    </div>
                    <div class="form-group">
                        <label for="milestone-category">类别</label>
                        <select id="milestone-category">
                            <option value="movement">运动能力</option>
                            <option value="feeding">饮食</option>
                            <option value="speech">语言</option>
                            <option value="social">社交</option>
                            <option value="other">其他</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>定格照片</label>
                        <div class="image-upload">
                            <input type="file" id="milestone-upload" accept="image/*" multiple>
                            <i class="fa fa-cloud-upload text-4xl text-gray-400 mb-2"></i>
                            <p class="text-gray-500">点击或拖拽照片到此处上传（可选）</p>
                        </div>
                        <div id="milestone-preview" class="preview-container"></div>
                    </div>
                </div>
            `;
            break;

        case 'diary':
            formHtml = `
                <div class="space-y-4">
                    <div class="form-group">
                        <label for="diary-title">日记标题</label>
                        <input type="text" id="diary-title" placeholder="今天的主题是...">
                    </div>
                    <div class="form-group">
                        <label for="diary-date">日期</label>
                        <input type="date" id="diary-date" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="form-group">
                        <label for="diary-content">日记内容</label>
                        <textarea id="diary-content" rows="6" placeholder="记录宝贝今天的点点滴滴..."></textarea>
                    </div>
                    <div class="form-group">
                        <label>相关照片</label>
                        <div class="image-upload">
                            <input type="file" id="diary-upload" accept="image/*" multiple>
                            <i class="fa fa-cloud-upload text-4xl text-gray-400 mb-2"></i>
                            <p class="text-gray-500">点击或拖拽照片到此处上传（可选）</p>
                        </div>
                        <div id="diary-preview" class="preview-container"></div>
                    </div>
                    <div class="form-group">
                        <label>标签</label>
                        <div class="tags-input" id="diary-tags">
                            <input type="text" class="tag-input" placeholder="输入标签，按回车添加">
                        </div>
                    </div>
                </div>
            `;
            break;

        case 'profile':
            formHtml = `
                <div class="space-y-6">
                    <div class="text-center">
                        <div
                            class="w-24 h-24 rounded-full bg-blue/10 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg mx-auto mb-4">
                            <i class="fa fa-baby text-4xl text-blue"></i>
                        </div>
                        <button id="change-avatar-btn" class="text-sm text-blue hover:text-blue/80">更换头像</button>
                        <input type="file" id="baby-avatar-upload" accept="image/*" class="hidden">
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-dark/70 mb-1">姓名</label>
                            <input type="text" id="baby-name"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-blue transition-custom"
                                value="${currentBabyInfo.name || '小宝贝'}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-dark/70 mb-1">性别</label>
                            <select id="baby-gender"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-blue transition-custom">
                                <option value="男孩" ${currentBabyInfo.gender === '男孩' ? 'selected' : ''}>男孩</option>
                                <option value="女孩" ${currentBabyInfo.gender === '女孩' ? 'selected' : ''}>女孩</option>
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-dark/70 mb-1">出生日期</label>
                        <input type="date" id="baby-birthday"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-blue transition-custom"
                            value="${currentBabyInfo.birthday || '2023-10-15'}">
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
                            <label class="block text-sm font-medium text-dark/70 mb-1">出生体重 (kg)</label>
<input type="number" step="0.01" id="baby-birth-weight"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-blue transition-custom"
                                value="${currentBabyInfo.birthWeight || '3.5'}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-dark/70 mb-1">出生身高 (cm)</label>
                            <input type="number" id="baby-birth-height"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-blue transition-custom"
                                value="${currentBabyInfo.birthHeight || '50'}">
                        </div>
                    </div>
                </div>
            `;
            break;
    }

    modalContent.innerHTML = formHtml;

    // 添加文件上传预览功能
    if (type === 'photo' || type === 'milestone' || type === 'diary') {
        const uploadInput = document.getElementById(`${type}-upload`);
        const previewContainer = document.getElementById(`${type}-preview`);

        if (uploadInput && previewContainer) {
            uploadInput.addEventListener('change', (e) => {
                handleFileUpload(e, previewContainer);
            });
        }
    }

    // 添加头像上传预览功能
    if (type === 'profile') {
        const avatarUpload = document.getElementById('baby-avatar-upload');
        const avatarPreview = document.getElementById('avatar-preview');
        const changeAvatarBtn = document.getElementById('change-avatar-btn');

        // 添加按钮点击事件，触发隐藏的文件上传输入框
        if (changeAvatarBtn && avatarUpload) {
            changeAvatarBtn.addEventListener('click', () => {
                avatarUpload.click();
            });
        }

        // 现有的预览功能代码保持不变
        if (avatarUpload && avatarPreview) {
            avatarUpload.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        avatarPreview.src = e.target.result;
                    };
                    reader.readAsDataURL(e.target.files[0]);
                }
            });
        }
    }

    // 添加标签输入功能
    if (type === 'diary') {
        setupTagsInput();
    }
}

// 处理文件上传和预览
function handleFileUpload(e, previewContainer) {
    const files = e.target.files;

    if (files) {
        Array.from(files).forEach(file => {
            // 检查是否为图片文件
            if (!file.type.startsWith('image/')) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                // 创建预览项
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="预览图" onerror="this.src='default-avatar.svg';">
                    <span class="remove-btn" data-index="${selectedImages.length}">×</span>
                `;

                // 添加删除功能
                const removeBtn = previewItem.querySelector('.remove-btn');
                removeBtn.addEventListener('click', (e) => {
                    if (!confirm('确定要删除这张图片吗？')) {
                        return;
                    }
                    const index = parseInt(e.target.dataset.index);
                    selectedImages.splice(index, 1);
                    previewItem.remove();
                    // 更新所有剩余预览项的索引
                    document.querySelectorAll('.preview-item .remove-btn').forEach((btn, idx) => {
                        btn.dataset.index = idx;
                    });
                });

                previewContainer.appendChild(previewItem);
                selectedImages.push(e.target.result);
            };
            reader.readAsDataURL(file);
        });
    }
}

// 设置标签输入功能
function setupTagsInput() {
    const tagsInput = document.getElementById('diary-tags');
    const tagInput = tagsInput.querySelector('.tag-input');

    tagInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && tagInput.value.trim()) {
            e.preventDefault();
            addTag(tagInput.value.trim());
            tagInput.value = '';
        }
    });

    function addTag(text) {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.innerHTML = `
            ${text}
            <span class="remove">×</span>
        `;

        const removeBtn = tag.querySelector('.remove');
        removeBtn.addEventListener('click', () => {
            if (confirm('确定要删除这个标签吗？')) {
                tag.remove();
            }
        });

        tagsInput.insertBefore(tag, tagInput);
    }
}

// 保存模态框数据
function saveModalData() {
    switch (currentModalType) {
        case 'photo':
            savePhoto();
            break;
        case 'milestone':
            saveMilestone();
            break;
        case 'diary':
            saveDiary();
            break;
        case 'profile':
            saveProfile();
            break;
    }

    closeModalWindow();
}

// 保存照片
function savePhoto() {
    const titleInput = document.getElementById('photo-title');
    const dateInput = document.getElementById('photo-date');
    if (!titleInput || !dateInput) {
        alert('表单元素未找到');
        return;
    }
    const title = titleInput.value.trim();
    const date = dateInput.value;

    if (!title) {
        alert('请输入照片标题');
        return;
    }

    if (selectedImages.length === 0) {
        alert('请上传至少一张照片');
        return;
    }

    selectedImages.forEach(imageUrl => {
        const photo = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            title: title,
            date: date,
            imageUrl: imageUrl,
            createdAt: new Date().toISOString()
        };

        currentPhotos.unshift(photo);
    });

    saveData();
    renderPhotos();
    selectedImages = [];
}

// 保存成长瞬间
function saveMilestone() {
    const titleInput = document.getElementById('milestone-title');
    const dateInput = document.getElementById('milestone-date');
    const descriptionInput = document.getElementById('milestone-description');
    const categoryInput = document.getElementById('milestone-category');
    const saveModal = document.getElementById('save-modal');
    const editId = saveModal.dataset.editId;

    if (!titleInput || !dateInput || !descriptionInput || !categoryInput) {
        alert('表单元素未找到');
        return;
    }

    const title = titleInput.value.trim();
    const date = dateInput.value;
    const description = descriptionInput.value.trim();
    const category = categoryInput.value;

    if (!title) {
        alert('请输入定格标题');
        return;
    }

    if (!date) {
        alert('请选择日期');
        return;
    }

    if (editId) {
        // 更新现有里程碑
        const index = currentMilestones.findIndex(m => m.id === editId);
        if (index !== -1) {
            const updatedMilestone = {
                ...currentMilestones[index],
                title: title,
                date: date,
                description: description,
                category: category,
                images: [...selectedImages.length ? selectedImages : currentMilestones[index].images]
            };
            currentMilestones[index] = updatedMilestone;
            // 清除编辑状态
            delete saveModal.dataset.editId;
        }
    } else {
        // 创建新里程碑
        const milestone = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            title: title,
            date: date,
            description: description,
            category: category,
            images: [...selectedImages],
            createdAt: new Date().toISOString()
        };
        currentMilestones.unshift(milestone);
    }
    saveData();
    renderMilestones();
    selectedImages = [];
}

// 保存日记
function saveDiary() {
    const title = document.getElementById('diary-title').value.trim();
    const date = document.getElementById('diary-date').value;
    const content = document.getElementById('diary-content').value.trim();

    if (!title) {
        alert('请输入日记标题');
        return;
    }

    if (!content) {
        alert('请输入日记内容');
        return;
    }

    // 获取标签
    const tags = Array.from(document.querySelectorAll('#diary-tags .tag'))
        .map(tag => tag.textContent.replace('×', '').trim());

    const diary = {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        title: title,
        date: date,
        content: content,
        images: [...selectedImages],
        tags: tags,
        createdAt: new Date().toISOString()
    };

    currentDiaries.unshift(diary);
    saveData();
    renderDiaries();
    selectedImages = [];
}

// 保存宝贝信息
function saveProfile() {
    const nameInput = document.getElementById('baby-name');
    const birthdayInput = document.getElementById('baby-birthday');
    const genderInput = document.getElementById('baby-gender');
    const birthWeightInput = document.getElementById('baby-birth-weight');
    const birthHeightInput = document.getElementById('baby-birth-height');

    if (!nameInput || !birthdayInput || !genderInput) {
        alert('表单元素未找到');
        return;
    }

    const name = nameInput.value.trim();
    const birthday = birthdayInput.value;
    const gender = genderInput.value;
    const birthWeight = birthWeightInput?.value || '3.5';
    const birthHeight = birthHeightInput?.value || '50';

    if (!name) {
        alert('请输入宝贝姓名');
        return;
    }

    if (!birthday) {
        alert('请选择出生日期');
        return;
    }

    currentBabyInfo = {
        name: name,
        birthday: birthday,
        gender: gender,
        birthWeight: birthWeight,
        birthHeight: birthHeight
    };

    saveData();
    renderProfile();
    closeModalWindow();

}

// 渲染个人资料
function renderProfile() {
    const profileContainer = document.getElementById('profile-container');
    if (!profileContainer) {
        console.error('个人资料容器未找到');
        return;
    }

    // 更新个人资料显示
    const nameElement = document.getElementById('profile-baby-name');
    const birthdayElement = document.getElementById('profile-baby-birthday');
    const genderElement = document.getElementById('profile-baby-gender');
    const birthWeightElement = document.getElementById('profile-baby-weight');
    const birthHeightElement = document.getElementById('profile-baby-height');
    const avatarElement = profileContainer.querySelector('.baby-avatar');

    // 更新顶部标题区域的宝贝信息
    const topNameElement = document.getElementById('p-baby-name');
    const topBirthdayElement = document.getElementById('p-baby-bitrhday'); // 注意这里是有拼写错误的ID

    if (nameElement) nameElement.textContent = currentBabyInfo?.name || '未设置';
    if (birthdayElement) birthdayElement.textContent = currentBabyInfo?.birthday || '未设置';
    if (genderElement) genderElement.textContent = currentBabyInfo?.gender || '未设置';
    if (birthWeightElement) birthWeightElement.textContent = (currentBabyInfo?.birthWeight || '3.5') + 'kg';
    if (birthHeightElement) birthHeightElement.textContent = (currentBabyInfo?.birthHeight || '50') + 'cm';
    if (avatarElement) avatarElement.src = currentBabyInfo?.avatar || 'default-avatar.svg';

    // 同时更新顶部标题区域的信息
    if (topNameElement) topNameElement.textContent = currentBabyInfo?.name || '小宝贝';
    if (topBirthdayElement) {
        // 格式化日期显示
        if (currentBabyInfo?.birthday) {
            const birthDate = new Date(currentBabyInfo.birthday);
            const formattedDate = `${birthDate.getFullYear()}年${birthDate.getMonth() + 1}月${birthDate.getDate()}日`;
            topBirthdayElement.textContent = `${formattedDate}出生`;
        } else {
            topBirthdayElement.textContent = '2023年10月15日出生';
        }
    }
}

// 更新宝贝信息显示
function updateBabyInfo() {
    const babyNameElement = document.getElementById('profile-baby-name');
    const babyBirthdayElement = document.getElementById('profile-baby-birthday'); // 修改为正确的ID
    const babyGenderElement = document.getElementById('profile-baby-gender');


    if (babyNameElement) babyNameElement.textContent = currentBabyInfo?.name || '';
    if (babyBirthdayElement) babyBirthdayElement.textContent = currentBabyInfo?.birthday || '';
    if (babyGenderElement) babyGenderElement.textContent = currentBabyInfo?.gender || '';


    // 计算年龄
    const birthDate = new Date(currentBabyInfo.birthday);
    const today = new Date();
    let ageMonths = (today.getFullYear() - birthDate.getFullYear()) * 12;
    ageMonths -= birthDate.getMonth() + 1;
    ageMonths += today.getMonth() + 1;

    const years = Math.floor(ageMonths / 12);
    const months = ageMonths % 12;

    let ageText = '';
    if (years > 0) {
        ageText += `${years}岁`;
    }
    ageText += `${months}个月`;

    const babyAgeElement = document.getElementById('baby-age');
    if (babyAgeElement) {
        babyAgeElement.textContent = ageText;
    }
}

// 渲染照片列表
function renderPhotos() {
    if (!photoGallery) return;
    photoGallery.innerHTML = '';

    let sortedPhotos = [...currentPhotos];

    // 根据筛选条件排序
    switch (sortBy) {
        case 'recent':
            sortedPhotos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'oldest':
            sortedPhotos.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        default:
            // 保持原始顺序
            break;
    }

    sortedPhotos.forEach(photo => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item bg-white rounded-xl overflow-hidden shadow-md transform hover:scale-[1.02] hover:shadow-lg transition-custom';
        photoItem.dataset.id = photo.id;
        photoItem.innerHTML = `
            <div class="relative aspect-square overflow-hidden">
                <img src="${photo.imageUrl}" alt="${photo.title}" class="w-full h-full object-cover" onError="this.src='default-avatar.svg'">
                <div class="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-custom flex items-center justify-center gap-2">
                    <button class="bg-white/90 text-dark rounded-full p-2 hover:bg-white transition-custom" title="查看大图">
                        <i class="fa fa-search-plus"></i>
                    </button>
                    <button class="bg-white/90 text-dark rounded-full p-2 hover:bg-white transition-custom" title="编辑">
                        <i class="fa fa-pencil"></i>
                    </button>
                    <button class="bg-white/90 text-primary rounded-full p-2 hover:bg-white transition-custom" title="删除">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="p-3">
                <p class="text-sm text-dark/70 truncate" title="${photo.title}">${photo.title}</p>
                <p class="text-xs text-dark/50">${photo.date}</p>
            </div>
        `;

        // 添加图片点击事件
        photoItem.querySelector('img').addEventListener('click', () => {
            viewerImage.src = photo.imageUrl;
            viewerCaption.textContent = `${photo.title} - ${photo.date}`;
            imageViewer.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });

        photoGallery.appendChild(photoItem);
    });

    // 如果没有照片，显示空状态
    if (currentPhotos.length === 0) {
        photoGallery.innerHTML = `
            <div class="col-span-full text-center py-16">
                <i class="fa fa-picture-o text-6xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">还没有照片，点击上方按钮添加第一张照片吧！</p>
            </div>
        `;
    }
}

// 渲染成长瞬间列表
function renderMilestones() {
    const container = document.querySelector('#milestones-container');
    if (!container) {
        console.error('里程碑容器元素未找到');
        return;
    }
    // 使用已检查的容器变量
    const milestonesContainer = container;
    milestonesContainer.innerHTML = '';

    // 根据筛选条件过滤
    const filteredMilestones = milestoneFilter === 'all'
        ? currentMilestones
        : currentMilestones.filter(milestone => milestone.category === milestoneFilter);

    filteredMilestones.forEach(milestone => {
        const milestoneItem = document.createElement('div');
        milestoneItem.className = 'bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-custom milestone-item';
        milestoneItem.dataset.id = milestone.id;

        // 获取类别图标
        const categoryIcons = {
            movement: '<i class="fa fa-child text-secondary text-xl"></i>',
            feeding: '<i class="fa fa-cutlery text-secondary text-xl"></i>',
            speech: '<i class="fa fa-comment text-secondary text-xl"></i>',
            social: '<i class="fa fa-heart text-secondary text-xl"></i>',
            other: '<i class="fa fa-star text-secondary text-xl"></i>',
            default: '<i class="fa fa-birthday-cake text-secondary text-xl"></i>'
        };

        const categoryIcon = categoryIcons[milestone.category] || categoryIcons.default;

        let imagesHtml = '';
        if (milestone.images && milestone.images.length > 0) {
            imagesHtml = `
                <div class="mt-4 flex flex-wrap gap-2">
                    ${milestone.images.slice(0, 4).map(img =>
                `<img src="${img}" alt="相关照片" class="w-20 h-20 rounded-lg object-cover" onError="this.src='default-avatar.svg'">`
            ).join('')}
                </div>
            `;
        }

        // 计算年龄标签
        const ageLabel = calculateAgeLabel(milestone.date);

        milestoneItem.innerHTML = `
            <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    ${categoryIcon}
                </div>
                <div class="flex-1">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="font-bold text-lg">${milestone.title}</h3>
                        <span class="px-3 py-1 bg-secondary/10 text-secondary text-xs rounded-full">${ageLabel}</span>
                    </div>
                    <p class="text-dark/70 mb-4">${milestone.description}</p>
                    ${imagesHtml}
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-1 text-dark/50 text-sm">
                            <i class="fa fa-calendar-check-o"></i>
                            <span>${milestone.date}</span>
                        </div>
                        <div class="flex gap-3">
                            <button class="edit-btn text-dark/60 hover:text-secondary transition-custom" title="编辑">
                                <i class="fa fa-pencil"></i>
                            </button>
                            <button class="text-dark/60 hover:text-secondary transition-custom" title="删除">
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        milestonesContainer.appendChild(milestoneItem);
    });

    // 如果没有里程碑，显示空状态
    if (currentMilestones.length === 0) {
        milestonesContainer.innerHTML = `
            <div class="text-center py-16 bg-white rounded-xl">
                <i class="fa fa-star text-6xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">还没有记录成长瞬间，点击上方按钮添加第一个重要时刻吧！</p>
            </div>
        `;
    }
}

// 计算年龄标签
function calculateAgeLabel(dateString) {
    // 如果没有calculateAgeFromDate函数或日期为空，则返回默认值
    if (typeof calculateAgeFromDate !== 'function' || !dateString) {
        return '未知';
    }

    try {
        const ageText = calculateAgeFromDate(dateString);

        // 处理不同格式的年龄
        if (ageText.includes('岁')) {
            // 如果是1岁以上，只保留岁部分
            if (ageText.startsWith('1岁')) {
                return '1岁';
            }
            // 对于2岁以上，可以保留岁和月
            return ageText;
        } else if (ageText.includes('个月')) {
            // 对于几个月的，显示完整的月份
            return ageText.replace('个月', '个月');
        } else if (ageText.includes('天')) {
            // 对于天数，显示几天
            return ageText;
        }

        return ageText;
    } catch (e) {
        return '未知';
    }
}

// 渲染日记列表
function renderDiaries() {
    const container = document.querySelector('#diaries-container');
    if (!container) {
        console.error('日记容器元素未找到 - 检查HTML结构是否正确');
        return;
    }
    // 使用已检查的容器变量
    const diaryContainer = container;
    if (!diaryContainer) {
        console.error('日记容器元素未找到');
        return;
    }
    diaryContainer.innerHTML = '';

    // 根据搜索关键词筛选
    const filteredDiaries = diarySearchQuery
        ? currentDiaries.filter(diary =>
        (diary.title.toLowerCase().includes(diarySearchQuery) ||
            diary.content.toLowerCase().includes(diarySearchQuery)))
        : currentDiaries;

    filteredDiaries.forEach(diary => {
        const diaryItem = document.createElement('div');
        diaryItem.className = 'diary-item bg-white rounded-xl overflow-hidden shadow-md transition-custom';
        diaryItem.dataset.id = diary.id;

        let imagesHtml = '';
        if (diary.images && diary.images.length > 0) {
            imagesHtml = `
                <div class="flex flex-wrap gap-3 mb-4">
                    ${diary.images.slice(0, 5).map(img =>
                `<img src="${img}" alt="日记照片" class="w-20 h-20 rounded-md object-cover">`
            ).join('')}
                </div>
            `;
        }
        let tagsHtml = '';
        if (diary.tags && diary.tags.length > 0) {
            tagsHtml = `
                <div class="flex flex-wrap gap-2 mb-3">
                    ${diary.tags.map(tag =>
                `<span class="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">${tag}</span>`
            ).join('')}
                </div>
            `;
        }

        diaryItem.innerHTML = `
            <div class="p-5">
                <div class="flex justify-between items-start mb-3">
                    <h3 class="font-bold text-lg">${diary.title}</h3>
                    <span class="text-sm text-dark/50">${diary.date}</span>
                </div>
                <p class="text-dark/70 mb-4 leading-relaxed">${diary.content}</p>
                ${imagesHtml}
                ${tagsHtml}
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-1 text-dark/50 text-sm">
                        <i class="fa fa-calendar-check-o"></i>
                        <span>${calculateAgeFromDate(diary.date)}</span>
                    </div>
                    <div class="flex gap-3">
                        <button class="text-dark/60 hover:text-primary transition-custom" title="编辑">
                            <i class="fa fa-pencil"></i>
                        </button>
                        <button class="text-dark/60 hover:text-primary transition-custom" title="删除">
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        diaryContainer.appendChild(diaryItem);
    });

    // 如果没有日记，显示空状态
    if (currentDiaries.length === 0) {
        diaryContainer.innerHTML = `
            <div class="text-center py-16 bg-white rounded-xl">
                <i class="fa fa-book text-6xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">还没有写日记，点击上方按钮开始记录宝贝的成长点滴吧！</p>
            </div>
        `;
    }
}

// 打开图片查看器
function openImageViewer(e) {
    viewerImage.src = e.target.src;
    viewerCaption.textContent = e.target.alt;
    imageViewer.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}
// 关闭图片查看器
function closeImageViewerWindow() {
    imageViewer.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// 删除照片详情页的照片
document.addEventListener('click', (e) => {
    if (e.target.closest('.photo-detail .delete-btn')) {
        const photoId = e.target.closest('.delete-btn').dataset.id;
        const photoItem = document.querySelector(`.photo-item[data-id="${photoId}"]`);
        if (photoItem && confirm('确定要删除这个成长瞬间吗？')) {
            deleteItem(photoItem);
            showSection('photos'); // 返回照片列表页
        }
    }
});

// 删除项目
function deleteItem(item) {
    const id = item.dataset.id;
    let itemType;

    if (item.classList.contains('photo-item')) {
        itemType = '照片';
        currentPhotos = currentPhotos.filter(photo => photo.id !== id);
    } else if (item.classList.contains('milestone-item')) {
        itemType = '成长瞬间';
        currentMilestones = currentMilestones.filter(milestone => milestone.id !== id);
    } else if (item.classList.contains('diary-item')) {
        itemType = '日记';
        currentDiaries = currentDiaries.filter(diary => diary.id !== id);
    }

    saveData();
    item.remove();

    // 重新渲染以检查是否需要显示空状态
    if (item.classList.contains('photo-item')) renderPhotos();
    if (item.classList.contains('milestone-item')) renderMilestones();
    if (item.classList.contains('diary-item')) renderDiaries();
}

// 渲染已选择的图片
function renderSelectedImages() {
    const previewContainer = document.querySelector('.preview-container');
    if (!previewContainer) return;

    previewContainer.innerHTML = '';

    selectedImages.forEach((imageUrl, index) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        previewItem.innerHTML = `
            <img src="${imageUrl}" alt="预览图">
            <span class="remove-btn" data-index="${index}">×</span>
        `;

        // 添加删除功能
        const removeBtn = previewItem.querySelector('.remove-btn');
        removeBtn.addEventListener('click', (e) => {
            const idx = parseInt(e.target.dataset.index);
            selectedImages.splice(idx, 1);
            previewItem.remove();
            // 更新所有剩余预览项的索引
            document.querySelectorAll('.preview-item .remove-btn').forEach((btn, i) => {
                btn.dataset.index = i;
            });
        });

        previewContainer.appendChild(previewItem);
    });
}

// 编辑项目
function editItem(item) {
    const id = item.dataset.id;

    if (item.classList.contains('photo-item')) {
        const photo = currentPhotos.find(p => p.id === id);
        if (photo) {
            openModal('photo');
            document.getElementById('photo-title').value = photo.title;
            document.getElementById('photo-date').value = photo.date;
            // 设置编辑状态
            saveModal.dataset.editId = id;
            // 清空之前的选择并显示当前照片
            selectedImages = [photo.imageUrl];
            renderSelectedImages();
        }
        return;
    } else if (item.classList.contains('milestone-item')) {
        const milestone = currentMilestones.find(m => m.id === id);
        if (milestone) {
            openModal('milestone');
            document.getElementById('milestone-title').value = milestone.title;
            document.getElementById('milestone-date').value = milestone.date;
            document.getElementById('milestone-description').value = milestone.description;
            document.getElementById('milestone-category').value = milestone.category;
            selectedImages = [...milestone.images];
            // 删除原里程碑，保存时会添加新的
            currentMilestones = currentMilestones.filter(m => m.id !== id);
        }
    } else if (item.classList.contains('diary-item')) {
        const diary = currentDiaries.find(d => d.id === id);
        if (diary) {
            openModal('diary');
            document.getElementById('diary-title').value = diary.title;
            document.getElementById('diary-date').value = diary.date;
            document.getElementById('diary-content').value = diary.content;
            selectedImages = [...diary.images];
            // 删除原日记，保存时会添加新的
            currentDiaries = currentDiaries.filter(d => d.id !== id);
        }
    }
}

// 计算指定日期对应的年龄
function calculateAgeFromDate(dateString) {
    const date = new Date(dateString);
    const birthDate = new Date(currentBabyInfo.birthday);
    let ageMonths = (date.getFullYear() - birthDate.getFullYear()) * 12;
    ageMonths -= birthDate.getMonth() + 1;
    ageMonths += date.getMonth() + 1;

    const years = Math.floor(ageMonths / 12);
    const months = ageMonths % 12;
    const days = Math.floor((date - birthDate) / (1000 * 60 * 60 * 24));

    if (days < 30) {
        return `${days}天`;
    } else if (years === 0) {
        return `${months}个月`;
    } else {
        return `${years}岁${months}个月`;
    }
}

// 加载更多照片（模拟分页）
function loadMorePhotos() {
    // 这里可以实现真实的分页加载逻辑
    alert('已加载全部照片');
    document.getElementById('load-more-photos').disabled = true;
    document.getElementById('load-more-photos').textContent = '没有更多照片了';
}

// 保存数据到本地存储
function saveData() {
    const path = window.location.pathname;

    localStorage.setItem('babyInfo', JSON.stringify(currentBabyInfo));
    localStorage.setItem('photos', JSON.stringify(currentPhotos));
    localStorage.setItem('milestones', JSON.stringify(currentMilestones));
    localStorage.setItem('diaries', JSON.stringify(currentDiaries));

    // 根据当前页面路径调用相应的渲染函数
    if (path.includes('gallery.html')) {
        renderPhotos();
    } else if (path.includes('milestones.html')) {
        if (document.querySelector('#milestones-container')) renderMilestones();
    } else if (path.includes('diary.html')) {
        if (document.querySelector('#diaries-container')) renderDiaries();
    } else if (path.includes('profile.html')) {
        updateBabyInfo();
        renderProfile();
    }
}

// 从本地存储加载数据
function loadData() {
    const savedBabyInfo = localStorage.getItem('babyInfo');
    const savedPhotos = localStorage.getItem('photos');
    const savedMilestones = localStorage.getItem('milestones');
    const savedDiaries = localStorage.getItem('diaries');

    if (savedBabyInfo) {
        currentBabyInfo = JSON.parse(savedBabyInfo);
    }

    if (savedPhotos) {
        currentPhotos = JSON.parse(savedPhotos);
    }

    if (savedMilestones) {
        currentMilestones = JSON.parse(savedMilestones);
    }

    if (savedDiaries) {
        currentDiaries = JSON.parse(savedDiaries);
    }

    // 如果没有数据，添加一些示例数据
    if (currentPhotos.length === 0 && currentMilestones.length === 0 && currentDiaries.length === 0) {
        addSampleData();
    }
}

// 添加示例数据
function addSampleData() {
    // 示例照片
    currentPhotos = [
        {
            id: '1',
            title: '出生第一天',
            date: '2023-01-01',
            imageUrl: 'https://picsum.photos/id/1005/500/500',
            createdAt: '2023-01-01T10:00:00Z'
        },
        {
            id: '2',
            title: '第一次洗澡',
            date: '2023-01-03',
            imageUrl: 'https://picsum.photos/id/1012/500/500',
            createdAt: '2023-01-03T15:00:00Z'
        }
    ];

    // 示例成长瞬间
    currentMilestones = [
        {
            id: '1',
            title: '第一次吃辅食',
            date: '2023-06-15',
            description: '宝贝今天第一次尝试吃米粉，刚开始有些抗拒，但很快就爱上了新的味道！',
            category: 'feeding',
            images: ['https://picsum.photos/id/292/100/100', 'https://picsum.photos/id/433/100/100'],
            createdAt: '2023-06-15T12:00:00Z'
        },
        {
            id: '2',
            title: '第一次翻身',
            date: '2023-04-20',
            description: '太棒了！宝贝今天终于学会了从仰卧翻到俯卧，虽然还不太熟练，但这是成长的重要一步！',
            category: 'movement',
            images: [],
            createdAt: '2023-04-20T10:30:00Z'
        }
    ];


    currentDiaries = [
        {
            id: '1',
            title: '百日纪念',
            date: '2023-04-10',
            content: '今天是宝贝的百日纪念日，我们举办了一个小型的家庭聚会来庆祝。宝贝今天特别精神，对着大家笑个不停，似乎知道今天是个特别的日子。时间过得真快，从出生时的小不点儿，到现在会认人、会笑，每一步成长都让我们感到无比幸福。',
            images: ['https://picsum.photos/id/177/200/200', 'https://picsum.photos/id/342/200/200', 'https://picsum.photos/id/338/200/200'],
            tags: ['百日纪念', '家庭聚会'],
            createdAt: '2023-04-10T19:00:00Z'
        }
    ];
}

document.addEventListener('DOMContentLoaded', init);