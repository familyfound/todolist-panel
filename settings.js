
module.exports = {
  display: {
    _group: true,
    insertBefore: {
      title: 'Insert Before',
      description: 'Where on the person page should the panel be inserted?',
      value: 'LifeSketchVitalSection',
      type: 'select',
      options: [
        ['Vital Information', 'LifeSketchVitalSection'],
        ['Other Information', 'LifeSketchNonVitalSection'],
        ['Family Members', 'FamilyMembersSection'],
        ['Sources', 'SourcesSection'],
        ['Discussions', 'DiscussionsSection'],
        ['Temple Ordinances', 'TempleOrdinancesSection'],
        ['<Last>', 'last']
      ]
    }
  }
};

