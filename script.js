function addSubject() {
  const subjectList = document.getElementById('subjectList');
  const row = document.createElement('div');
  row.className = 'row';
  row.innerHTML = `
    <input type="text" placeholder="Subject Name" required>
    <input type="number" class="grade" placeholder="1.75" min="1.00" max="5.00" step="0.25" required>
    <input type="number" class="weight" placeholder="Units" min="0" step="0.5" value="3" required>
    <button type="button" class="btn-remove" onclick="removeRow(this)" title="Remove subject">×</button>
  `;
  subjectList.appendChild(row);
}

function removeRow(button) {
  const subjectList = document.getElementById('subjectList');
  if (subjectList.children.length > 1) {
    button.parentElement.remove();
  } else {
    alert("You need at least one subject to calculate a grade.");
  }
}

document.getElementById('gradeForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const grades = document.querySelectorAll('.grade');
  const weights = document.querySelectorAll('.weight');

  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (let i = 0; i < grades.length; i++) {
    const gradeValue = parseFloat(grades[i].value) || 0;
    const units = parseFloat(weights[i].value) || 0;

    // Multiply the 1.00-5.00 grade directly by the course units
    totalWeightedScore += gradeValue * units;
    totalWeight += units;
  }

  const finalGWA = totalWeight > 0 ? (totalWeightedScore / totalWeight) : 0;

  const resultBox = document.getElementById('resultBox');
  const finalScoreEl = document.getElementById('finalScore');
  const gradeNoteEl = document.getElementById('gradeNote');

  finalScoreEl.textContent = `GWA: ${finalGWA.toFixed(4)}`;
  gradeNoteEl.textContent = `Total Units: ${totalWeight} | Computed from 1.00 - 5.00 scale`;

  resultBox.style.display = 'block';
});

function resetForm() {
  document.getElementById('gradeForm').reset();
  document.getElementById('resultBox').style.display = 'none';
}