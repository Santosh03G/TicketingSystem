package com.ticketingsystem.controller;

import com.ticketingsystem.model.Setting;
import com.ticketingsystem.repository.SettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*")
public class SettingController {

    @Autowired
    private SettingRepository settingRepository;

    @GetMapping
    public List<Setting> getAllSettings() {
        return settingRepository.findAll();
    }

    @PostMapping
    public Setting createOrUpdateSetting(@RequestBody Setting setting) {
        return settingRepository.save(setting);
    }

    @PostMapping("/batch")
    public List<Setting> createOrUpdateSettings(@RequestBody List<Setting> settings) {
        return settingRepository.saveAll(settings);
    }
}
