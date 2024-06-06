document.addEventListener('DOMContentLoaded', () => {
    const groupNameInput = document.getElementById('groupName');
    const groupDescriptionInput = document.getElementById('groupDescription');
    const profileIdInput = document.getElementById('profileId');
    const addMemberBtn = document.getElementById('addMemberBtn');
    const createGroupBtn = document.getElementById('createGroupBtn');
    const membersList = document.querySelector('.membersList');
    
    let members = [];

    addMemberBtn.addEventListener('click', () => {
        const profileId = profileIdInput.value.trim();

        if (profileId === '') {
            alert('Profile ID cannot be empty');
            return;
        }

        members.push({ profileId });

        const li = document.createElement('li');
        li.textContent = `Profile ID: ${profileId}`;
        membersList.appendChild(li);

        profileIdInput.value = '';
    });

    createGroupBtn.addEventListener('click', (event) => {
        event.preventDefault();
        
        const groupName = groupNameInput.value.trim();
        const groupDescription = groupDescriptionInput.value.trim();

        if (groupName === '') {
            alert('Group name cannot be empty');
            return;
        }

        const group = {
            name: groupName,
            description: groupDescription,
            members: members
        };

        console.log('Creating group:', group);
        saveGroupAsFile(group);
    });

    function saveGroupAsFile(group) {
        let savedGroups = JSON.parse(localStorage.getItem('savedGroups')) || [];
        savedGroups.push(group);
        localStorage.setItem('savedGroups', JSON.stringify(savedGroups));
    
        const blob = new Blob([JSON.stringify(group, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${group.name}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    
});
