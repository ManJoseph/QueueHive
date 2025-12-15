package queuehive.queuehive.service;

import queuehive.queuehive.dto.DashboardOverviewDto;
import queuehive.queuehive.dto.TokenDto;
import queuehive.queuehive.dto.UserDto;

import java.util.List;

public interface SuperAdminService {
    DashboardOverviewDto getDashboardOverview();
    List<UserDto> getAllUsers();
    void deleteUser(Long userId);
    List<TokenDto> getAllTokens();
}
